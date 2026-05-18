const fs = require("fs");
const path = require("path");

const files = fs.readdirSync(".")
  .filter(f => f.endsWith(".js") && !f.startsWith("check_links") && !f.startsWith("scratch"));

const allUrls = new Set();
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const urlRegex = /(https?:\/\/[^\s"'`]+)/g;
  const match = content.match(urlRegex) || [];
  for (let u of match) {
      if (!u.includes("localhost") && !u.includes("127.0.0.1") && !u.includes("w3.org")) {
          allUrls.add(u);
      }
  }
}
const urls = [...allUrls];

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
