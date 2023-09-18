require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (_req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urls = [];

app.get("/api/shorturl/:short_url", function (req, res) {
  console.log("GET", req.params);

  const id = +req.params.short_url;
  const url = urls.find(url => url.short_url === id);
  if (!url) {
    return res.status(404).json({ error: "url not found" });
  }

  res.redirect(url.original_url);
});

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const original_url = req.body.url;

  console.log("POST", original_url);

  try {
    const url = new URL(original_url);
    dns.lookup(url.hostname, err => {
      if (err || !url.protocol.startsWith("http")) {
        console.log("err", err, url.protocol);
        return res.status(400).json({ error: "invalid url" });
      }

      const site = { original_url, short_url: urls.length + 1 };
      urls.push(site);

      res.json(site);
    });
  } catch (_ex) {
    res.status(400).json({ error: "invalid url" });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
