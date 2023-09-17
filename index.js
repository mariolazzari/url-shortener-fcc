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

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urls = [];

app.get("/api/shorturl/:short_url", function (req, res) {
  const url = urls.find(url => url.short_url === req.params.short_url);
  res.json({ url });
});

// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
  const original_url = req.body.url;
  const url = new URL(original_url);

  dns.lookup(url.hostname, (err, data) => {
    if (err) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const short_url = urls.length + 1;
    urls.push({ original_url, short_url });

    res.json({ original_url, short_url });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
