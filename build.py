from pathlib import Path
import re, json
from PIL import Image, ImageDraw
root=Path(__file__).parent
data=(root/'dist/data.mjs').read_text()
data=re.sub(r'^export ', '', data, flags=re.M)
app=(root/'app.mjs').read_text()
app=re.sub(r'^import .*?;\n','',app,count=1,flags=re.M)
html=(root/'template.html').read_text().replace('/*STYLE*/',(root/'style.css').read_text()).replace('/*APP*/',data+'\n'+app)
(root/'dist/index.html').write_text(html)
(root/'dist/Rocce_in_tasca_v1.0.html').write_text(html)
for size in (192,512):
    image=Image.new('RGB',(512,512),'#193d35')
    draw=ImageDraw.Draw(image)
    draw.polygon([(105,293),(144,168),(257,109),(364,157),(411,266),(362,371),(223,407),(111,351)],fill='#c9b5a0')
    draw.polygon([(105,293),(240,259),(257,109),(144,168)],fill='#e1cdb6')
    draw.polygon([(240,259),(364,157),(411,266),(362,371)],fill='#b8a18d')
    draw.polygon([(105,293),(111,351),(223,407),(240,259)],fill='#8b7764')
    draw.line([(144,168),(240,259),(362,371)],fill='#637163',width=8)
    draw.line([(240,259),(257,109)],fill='#637163',width=8)
    image.resize((size,size),Image.Resampling.LANCZOS).save(root/f'dist/icon-{size}.png')
hosting=root/'.openai/hosting.json'
if hosting.exists():
    manifest=json.loads(hosting.read_text())
    manifest['static']={'directory':'dist'}
    hosting.write_text(json.dumps(manifest,indent=2)+'\n')
print('HTML autonomo, icone e manifest pronti.')
