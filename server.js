const express = require('express');
const bodyParser = require('body-parser');
const scraper = require('./index');

const app = express();
app.use(bodyParser.json());

app.post('/scrape', async (req, res) => {
  try {
    await scraper(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Scraper crashed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));
