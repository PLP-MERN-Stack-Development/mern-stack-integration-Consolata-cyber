const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const apiUrl = process.env.API_URL || 'http://localhost:5000';

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Capturing Home (desktop)...');
  await page.goto(clientUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '01_home.png'), fullPage: true });

  console.log('Capturing Login page...');
  await page.goto(`${clientUrl}/login`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '04_login_register.png'), fullPage: true });

  console.log('Capturing Create Post (desktop)...');
  await page.goto(`${clientUrl}/create-post`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '03_create_post.png'), fullPage: true });

  console.log('Capturing Home (mobile viewport)...');
  const mobileViewport = { width: 390, height: 844 };
  await context.setViewportSize(mobileViewport);
  await page.goto(clientUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotsDir, '05_mobile_home.png'), fullPage: true });

  // Try to capture a post detail if posts exist
  try {
    console.log('Fetching posts from API to capture a post detail (if any)...');
    const res = await (await fetch(`${apiUrl}/api/posts`)).json();
    const firstPost = res?.posts && res.posts.length ? res.posts[0] : null;
    if (firstPost && firstPost._id) {
      await context.setViewportSize({ width: 1280, height: 800 });
      console.log(`Capturing Post detail for id ${firstPost._id}...`);
      await page.goto(`${clientUrl}/posts/${firstPost._id}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(screenshotsDir, '02_post_detail.png'), fullPage: true });
    } else {
      console.log('No posts returned by API; skipping post detail screenshot.');
    }
  } catch (err) {
    console.log('Error fetching posts from API (maybe server not running):', err.message);
  }

  // Capture server logs instruction: if server.log exists, snapshot it
  const serverLogPath = path.resolve(__dirname, '..', 'server', 'server.log');
  if (fs.existsSync(serverLogPath)) {
    console.log('Saving server.log snapshot as image (text file will also be copied).');
    const dest = path.join(screenshotsDir, '06_server_logs.txt');
    fs.copyFileSync(serverLogPath, dest);
  } else {
    console.log('No server.log found; please save server console output to server/server.log if you want it captured.');
  }

  await browser.close();
  console.log('Screenshots saved to:', screenshotsDir);
})().catch(err => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
