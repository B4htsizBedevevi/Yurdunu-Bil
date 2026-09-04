const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EXTENSIONS = new Set([".html", ".js", ".css", ".json", ".md", ".txt"]);
const SKIP_DIRS = new Set([".git", "node_modules"]);

const direct = new Map([
  ["Ã¼", "ü"], ["Ãœ", "Ü"], ["Ã¶", "ö"], ["Ã–", "Ö"],
  ["Ã§", "ç"], ["Ã‡", "Ç"], ["Ä±", "ı"], ["Ä°", "İ"],
  ["ÄŸ", "ğ"], ["Äž", "Ğ"], ["ÅŸ", "ş"], ["Åž", "Ş"],
  ["âœ“", "✓"], ["âœ”", "✔"], ["âœ•", "✕"],
  ["â†’", "→"], ["â†�", "←"], ["â†‘", "↑"], ["â†“", "↓"],
  ["â€“", "–"], ["â€”", "—"], ["â€¦", "…"], ["â€¢", "•"],
  ["â˜…", "★"], ["â˜†", "☆"], ["âš¡", "⚡"], ["âš ", "⚠"],
  ["âœ¨", "✨"], ["Â°", "°"], ["Â·", "·"], ["Â©", "©"], ["Â®", "®"]
]);

function decodeLatin1Utf8(segment) {
  try {
    const bytes = Uint8Array.from([...segment], ch => ch.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return segment;
  }
}

function repair(value) {
  let text = value;

  for (const [bad, good] of direct) {
    text = text.split(bad).join(good);
  }

  // Repair remaining UTF-8-as-Latin-1 fragments while preserving real Unicode.
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    text = text.replace(/[\u0000-\u00ff]*[ÃÂÄÅâ][\u0000-\u00ff]*/g, match => {
      if (!/[ÃÂÄÅâ]/.test(match)) return match;
      const decoded = decodeLatin1Utf8(match);
      if (decoded !== match && !decoded.includes("�")) {
        changed = true;
        return decoded;
      }
      return match;
    });
    if (!changed) break;
  }

  return text;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
      continue;
    }

    const file = path.join(dir, entry.name);
    if (!EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;

    const before = fs.readFileSync(file, "utf8");
    const after = repair(before);
    if (after !== before) {
      fs.writeFileSync(file, after, "utf8");
      console.log(`Repaired: ${path.relative(ROOT, file)}`);
    }
  }
}

walk(ROOT);
console.log("UTF-8 mojibake audit complete.");
