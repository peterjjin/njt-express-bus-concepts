"""Check the exact publish manifest and static links; no external tile requests."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
import hashlib
import json

ROOT = Path(__file__).resolve().parent
SITE = ROOT / 'site'


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        self.links.extend(v for k, v in attrs if k in ('src', 'href') and v)


manifest = json.loads((ROOT / 'publish-manifest.json').read_text(encoding='utf-8'))
expected = {item['path'] for item in manifest}
actual = {p.relative_to(SITE).as_posix() for p in SITE.rglob('*') if p.is_file()}
assert actual == expected, 'Publishing files differ from the reviewed manifest'
for item in manifest:
    file = SITE / item['path']
    assert file.stat().st_size == item['bytes'], item['path']
    assert hashlib.sha256(file.read_bytes()).hexdigest() == item['sha256'], item['path']
for page in SITE.rglob('*.html'):
    parser = Links()
    parser.feed(page.read_text(encoding='utf-8'))
    for href in parser.links:
        parts = urlsplit(href)
        if parts.scheme or href.startswith(('#', '//')):
            continue
        target = (page.parent / unquote(parts.path)).resolve()
        assert target.is_relative_to(SITE) and target.exists(), (page.name, href)
print(f'Validated {len(manifest)} publishing files and all static local links; no basemap tiles downloaded.')
