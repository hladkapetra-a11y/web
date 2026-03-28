const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hladk\\Desktop\\Weby\\klienti\\Plachy\\web';
function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update href attributes like href="/page.html" or href="page.html"
      let newContent = content.replace(/href=["'](\/?[^"']*\w)\.html["']/g, 'href="$1"');

      // Update JS window.location overrides if they exist
      newContent = newContent.replace(/window\.location\.href\s*=\s*(['"])\/?([^'"]*\w)\.html\1/g, 'window.location.href = $1/$2$1');
      
      // Update data-include attributes if they contain .html? No, these are fragments, they should KEEP .html!
      // DO NOT match src="..." or data-include="..." files.
      // E.g. data-include="footer" was modified? No, our regex only matches `href=` and `window.location`.
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated', fullPath);
      }
    }
  }
}
processDir(dir);
