const { chromium } = require('playwright');

module.exports = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(\`https://www.tiktok.com/search?q=\${encodeURIComponent(query)}\`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  const results = await page.$$eval('div[data-e2e="search-video-item"]', nodes => {
    return nodes.slice(0, 10).map(node => {
      const caption = node.querySelector('[data-e2e="video-desc"]')?.innerText || "";
      const username = node.querySelector('[data-e2e="search-user-name"]')?.innerText || "";
      const link = node.querySelector('a')?.href || "";
      return { caption, username, link };
    });
  });

  await browser.close();
  res.json(results);
};
