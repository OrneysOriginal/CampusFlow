"""Create a standalone demo without third-party dependencies."""
from pathlib import Path
import re
p=Path(__file__).resolve().parent
out=p/'offline'
out.mkdir(exist_ok=True)
modules=['src/data/events.js','src/components/event-card.js','src/components/filters.js','src/components/header.js','src/pages/catalog.js','src/pages/event.js','src/pages/registration.js','src/main.js']
js=[]
for mod in modules:
    src=(p/mod).read_text()
    src=re.sub(r'^import .*?;\s*$', '', src, flags=re.M)
    src=re.sub(r'\bexport (?=(?:const|function|class)\b)', '', src)
    js.append(src)
(out/'app.js').write_text('\n'.join(js))
css='\n'.join((p/f'src/styles/{name}.css').read_text() for name in ['base','components','pages','responsive','mock-alignment'])
(out/'style.css').write_text(css)
html=(p/'index.html').read_text().replace('<script type="module" src="/src/main.js"></script>', '<link rel="stylesheet" href="style.css" />\n    <script defer src="app.js"></script>')
(out/'index.html').write_text(html)
print('Offline demo generated in offline/')
