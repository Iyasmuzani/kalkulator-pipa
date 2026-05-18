const fs = require("fs");
const content = fs.readFileSync("data-pustaka.js", "utf8");
const urlRegex = /(https?:\/\/[^\s"'`]+)/g;
const urls = [...new Set(content.match(urlRegex) || [])];

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok && res.status !== 405) {
      console.log(`❌ ERROR ${res.status}: ${url}`);
    } else {
      console.log(`✅ OK: ${url}`);
    }
  } catch (e) {
    try {
      const res2 = await fetch(url, { method: "GET", redirect: "follow" });
      if (!res2.ok) {
        console.log(`❌ ERROR ${res2.status} on GET: ${url}`);
      } else {
        console.log(`✅ OK (GET fallback): ${url}`);
      }
    } catch (e2) {
      console.log(`❌ FAILED (Network/Parse): ${url}`);
    }
  }
}

async function checkAll() {
  console.log(`Found ${urls.length} URLs. Checking...`);
  for (const url of urls) {
    await checkUrl(url);
  }
}
checkAll();
