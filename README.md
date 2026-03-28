# Stěhování Teplice — web (projekt) verze 1.1.10.

Krátký popis: Mobile-first malý více-stránkový web pro lokální stěhovací služby.

Struktura:
- index.html
- stehovani-v-cr.html
- stehovani-v-zahranici.html
- pujcovna-privesnych-voziku.html
- pujceni-karavanu.html
- prodej-propan-butanovych-lahvi.html
- kontakt.html
- 404.html
- css/styles.css
- js/main.js
- sitemap.xml, robots.txt, llms.txt, .htaccess

Jak spustit lokálně (Apache/XAMPP):
1. Zkopírujte složku do webrootu (např. htdocs v XAMPP).
2. Otevřete v prohlížeči: http://localhost/1001-stehovani-teplice/

Doporučení pro produkci:
- Nastavit bezpečnostní hlavičky na úrovni serveru (není v .htaccess kromě ErrorDocument):
  - Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline' https:;
  - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  - X-Frame-Options: DENY
  - Referrer-Policy: strict-origin-when-cross-origin
- Aktivovat gzip/brotli, nastavit dlouhý caching pro statické assety.
- Optimalizovat velké obrázky do AVIF/WEBP a přidat srcset pro responsive.

Kontrola:
- Validace HTML/CSS doporučena (W3C).
- Lighthouse audit pro performance, accessibility a best practices.

Poznámky:
- Vložte dodané obrázky do složek `Obrazky/` podle zadání a upravte cesty pokud je to nutné.
- Texty byly vloženy přesně v souladu s požadavkem; pokud budete chtít doplnit další copy, postupujte podle instrukcí v `instrukce.md`.
