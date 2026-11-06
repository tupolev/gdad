# SPDX-License-Identifier: GPL-3.0-only
from pathlib import Path
import json,zipfile,hashlib
from PIL import Image,ImageDraw
for browser in ['chrome','firefox']:
 d=Path('extensions')/browser;(d/'icons').mkdir(exist_ok=True)
 for size in [16,32,48,64,96,128]:
  # Draw at 8x resolution, then filter down for smooth edges at every size.
  scale=8; im=Image.new('RGBA',(size*scale,size*scale));g=ImageDraw.Draw(im)
  def box(coords):return tuple(round(v*size*scale/128) for v in coords)
  g.rounded_rectangle(box((4,4,124,124)),radius=round(28*size*scale/128),fill='#176348')
  # Optically centered download arrow, with rounded stem and a separate tray.
  g.rounded_rectangle(box((58,29,70,68)),radius=round(5*size*scale/128),fill='#FFFFFF')
  g.polygon([box((43,59)),box((85,59)),box((64,81))],fill='#FFFFFF')
  width=round((11 if size<=32 else 10)*size*scale/128)
  g.line([box((36,80)),box((36,95)),box((92,95)),box((92,80))],fill='#FFFFFF',width=width,joint='curve')
  for x,y in [(36,80),(92,80),(36,95),(92,95)]:
   cx,cy=box((x,y));r=width/2;g.ellipse((cx-r,cy-r,cx+r,cy+r),fill='#FFFFFF')
  im=im.resize((size,size),Image.Resampling.LANCZOS);im.save(d/'icons'/f'{size}.png')
 p=d/'manifest.json';m=json.loads(p.read_text());m.update(name='GDAD (Gmail Draft Attachment Downloader)',short_name='GDAD',version='0.4.1',description='__MSG_extensionDescription__')
 m['icons']={str(n):f'icons/{n}.png' for n in [16,32,48,64,96,128]};m['action']['default_title']='GDAD · Descargar adjuntos del borrador';m['action']['default_icon']={str(n):f'icons/{n}.png' for n in [16,32]};m['content_security_policy']={'extension_pages':"script-src 'self'; object-src 'none'"}
 if browser=='chrome':m['minimum_chrome_version']='109'
 else:m['browser_specific_settings']['gecko'].update(id='gdad@extensions.local',strict_min_version='140.0',data_collection_permissions={'required':['none']})
 if browser=='firefox':m['browser_specific_settings']['gecko_android']={'strict_min_version':'142.0'}
 p.write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8')
 p=d/'content.js';s=p.read_text(encoding='utf-8').replace("title.textContent='Adjuntos del borrador'","title.textContent='GDAD · Adjuntos del borrador'");p.write_text(s,encoding='utf-8')
