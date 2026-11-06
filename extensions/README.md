# GDAD browser extensions

## Chrome

Open `chrome://extensions`, enable Developer mode, select Load unpacked, and choose the `chrome` directory. Reload Gmail after installation or updates.

## Firefox

Open `about:debugging#/runtime/this-firefox`, select Load Temporary Add-on, and choose `firefox/manifest.json`. Firefox 140 or newer is required. This installation lasts until Firefox closes; permanent installation requires Mozilla signing.

## Using GDAD

Open a saved Gmail draft, wait for attachments to finish uploading, and click **ZIP** in its editor. If the toolbar cannot be located, the button appears beside the editor. Each button targets its own draft. Review the attachment list, select files, and download the ZIP. A manual retry link remains available if automatic saving fails. No search text, server, or OAuth credentials are required.

Repeated filenames are renamed during detection, before the extension: `photo.webp`, `photo (1).webp`, `photo (2).webp`. Comparison ignores case to avoid conflicts on Windows. Gmail's trailing display size, such as `(144 K)`, is removed from display-derived filenames; explicit original filename metadata takes precedence.

## Languages

English, Spanish, and German are supported. GDAD checks Gmail's document language whenever the panel is opened and messages are generated. If the language attribute is absent, it checks Gmail's accessible controls. Unsupported or unknown languages fall back to English. Reopen an existing panel after changing Gmail's language. Technical errors returned by Gmail or the browser retain their original wording.

## Permissions and privacy

- Gmail content script access inserts the ZIP button and reads attachment links from the selected draft.
- `activeTab` and `scripting` allow opening the panel through the browser toolbar icon.
- `downloads` starts saving and checks the state of downloads initiated by GDAD.

Files are processed in browser memory. There are no external libraries, analytics, or developer-side uploads. See [the privacy policy](../release/PRIVACY.md).

## Limits and verification

Only attachments with download links exposed by Gmail are supported. Drive links and uploads in progress are not downloaded. If links are unavailable, the panel displays an explanation. ZIPs are uncompressed and require sufficient memory. Drafts are never sent or deleted.

Firefox creates its download URL in the extension background context because Firefox rejects Gmail-owned Blob URLs in the downloads API. Prepared files remain available through the manual retry link.

Filename handling, duplicate naming, language detection, and the Firefox download flow have automated regression checks in `tools`. These checks do not replace testing against Gmail's live interface. The user has confirmed successful Firefox downloading; full visual testing in all languages remains pending.

Current version: **0.4.0** for both browsers. See [submission guidance](../release/PUBLISHING.md).
