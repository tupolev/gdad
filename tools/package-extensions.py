"""Build store-upload ZIPs with manifest at archive root. Run from repository root."""
from pathlib import Path
import hashlib,json,subprocess,zipfile
out=Path('release');out.mkdir(exist_ok=True)
checks=[]
for browser in ['chrome','firefox']:
 root=Path('extensions')/browser
 manifest=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
 for file in ['background.js','content.js']:
  subprocess.run(['node','--check',str(root/file)],check=True)
 for icon in manifest['icons'].values():assert (root/icon).is_file()
 name=f"gdad-{browser}-{manifest['version']}.zip"
 with zipfile.ZipFile(out/name,'w',zipfile.ZIP_DEFLATED) as z:
  for p in sorted(root.rglob('*')):
   if p.is_file():z.write(p,p.relative_to(root).as_posix())
 with zipfile.ZipFile(out/name) as z:
  assert z.testzip() is None
  assert 'manifest.json' in z.namelist()
 checks.append(hashlib.sha256((out/name).read_bytes()).hexdigest()+'  '+name)
(out/'SHA256SUMS.txt').write_text('\n'.join(checks)+'\n')
print('Both store packages built; syntax, icons, archive roots and CRC checked.')
