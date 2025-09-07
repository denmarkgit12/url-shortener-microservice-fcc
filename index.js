require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const urlPattern = /^https?:\/\/.+/;

  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  const shortUrl = counter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

app.get("/api/shorturl/:short", (req, res) => {
  const short = req.params.short;
  const originalUrl = urlDatabase[short];

  if (!originalUrl) {
    return res.json({ error: "No short URL found for given input" });
  }

  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
