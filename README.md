# GDAD — Gmail Draft Attachment Downloader

Browser extensions for Chrome and Firefox that add a **ZIP** button to Gmail's draft editor, allowing you to save draft attachments locally.

## Downloads

The first GitHub releases are **Chrome 0.4.0** and **Firefox 0.4.0**:

- [Chrome release](https://github.com/tupolev/gdad/releases/tag/chrome-v0.4.0)
- [Firefox release](https://github.com/tupolev/gdad/releases/tag/firefox-v0.4.0)

Download the browser-specific ZIP asset, rather than GitHub's automatically generated source archive. These ZIPs can also be submitted to Chrome Web Store and Mozilla Add-ons. Firefox's ZIP is unsigned; permanent installation requires Mozilla signing.

## Development installation

**Chrome:** extract the ZIP, open `chrome://extensions`, enable Developer mode, select Load unpacked, and choose the extracted folder (or `extensions/chrome` from this repository).

**Firefox:** open `about:debugging#/runtime/this-firefox`, select Load Temporary Add-on, and choose `extensions/firefox/manifest.json` (or the manifest from the extracted Firefox ZIP). Requires Firefox 140 or newer. Temporary installations are removed when Firefox closes.

Reload Gmail after installing or updating. Allow access to Gmail if the browser requests it.

## Usage

Open a draft and wait until Gmail finishes saving its attachments. Click ZIP in the draft editor, review the detected files, and download the selection. Duplicate filenames receive a numeric suffix before the extension, such as `photo (1).webp`. No server or OAuth setup is required.

GDAD supports English, Spanish, and German. The panel follows Gmail's current interface language, with English as the fallback. Close and reopen the panel after changing Gmail's language. Browser toolbar metadata follows the browser language.

## Repository

- `extensions/chrome`, `extensions/firefox`: browser-specific source, manifests, icons, and translations.
- `release`: upload packages, checksums, privacy policy, and submission guidance.
- `tools`: packaging, icon generation, translation generation, and regression checks.

## Development checks

Requires Node.js and Python. Pillow is only needed to regenerate icons.

```text
node tools/test-i18n.mjs
node tools/test-filenames.mjs
node tools/test-duplicate-filenames.mjs
node tools/test-firefox-download.mjs
python tools/package-extensions.py
npx --yes web-ext lint --source-dir extensions/firefox --warnings-as-errors
```

## Privacy and limitations

Attachments are processed locally, without analytics, advertising, or transmission to the developer. Attachment requests go directly to Gmail using your existing browser session. See the [privacy policy](release/PRIVACY.md).

GDAD depends on attachment links exposed by Gmail. It cannot export Google Drive links or files that are still uploading. ZIPs are built in memory without compression. Changes to Gmail's interface may require extension updates.

GDAD is independent and is not affiliated with Google or Mozilla. See the [submission guide](release/PUBLISHING.md) before submitting to the stores.

## License

Copyright (C) 2026 tupolev. GDAD source code, icons and documentation are licensed under the GNU General Public License version 3 only (`GPL-3.0-only`). See [LICENSE](LICENSE). Distributed without warranty. Version 0.4.1 adds the license and notice to both store-upload packages; earlier GitHub release assets are unchanged.
