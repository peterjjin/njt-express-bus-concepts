/* Shared Leaflet basemap connection; no proxies, prefetching, or token logging. */
(() => {
  'use strict';
  const config = window.EXPRESS_BASEMAP_CONFIG || {provider: 'osm'};
  const scriptBase = new URL('.', document.currentScript.src);
  function notice(message) {
    let box = document.getElementById('basemap-notice');
    if (!box) {
      box = document.createElement('aside');
      box.id = 'basemap-notice';
      box.setAttribute('role', 'status');
      box.style.cssText = 'padding:10px 26px;background:#fff3d9;border-bottom:1px solid #cfaa62;font:14px/1.5 Segoe UI,Arial,sans-serif;color:#203340';
      const before = document.querySelector('.maps');
      before.parentNode.insertBefore(box, before);
    }
    box.replaceChildren(document.createTextNode(message + ' '));
    const link = document.createElement('a');
    link.href = new URL('Map setup.html', scriptBase).href;
    link.target = '_top';
    link.textContent = 'Map connection instructions';
    box.appendChild(link);
  }
  window.ExpressBasemap = {
    install(maps) {
      if (!/^https?:$/.test(location.protocol)) {
        notice('Background tiles are paused because this page was opened as a local file. Run Start Map.cmd from the Interactive website folder, then use the localhost website. Route overlays remain available.');
        return;
      }
      if (config.provider === 'none') {
        notice('Background tiles are turned off in basemap-config.js. Route overlays remain available.');
        return;
      }
      let url, attribution;
      const osmCredit = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>';
      if (config.provider === 'osm') {
        url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = osmCredit + ' · <a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noopener">Map issue</a>';
      } else if (config.provider === 'maptiler') {
        const key = String(config.maptilerKey || '').trim();
        if (!key || /^(sk\.|pk\.)/.test(key) || !/^[a-zA-Z0-9_-]+$/.test(key)) {
          notice('MapTiler needs your own public browser map API key in basemap-config.js. Do not use a Mapbox token or any secret credential. No tile request was sent.');
          return;
        }
        const style = config.maptilerStyle || 'streets-v4';
        if (!/^[a-zA-Z0-9_-]+$/.test(style)) {
          notice('The MapTiler map style ID is invalid. No tile request was sent.');
          return;
        }
        url = `https://api.maptiler.com/maps/${style}/256/{z}/{x}/{y}.png?key=${encodeURIComponent(key)}`;
        attribution = '<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">&copy; MapTiler</a> ' + osmCredit;
      } else {
        notice('Unknown basemap provider. Check basemap-config.js.');
        return;
      }
      let stopped = false;
      const tiles = [];
      const stop = () => {
        if (stopped) return;
        stopped = true;
        // Do not keep retrying a failed/blocked provider or silently switch servers.
        setTimeout(() => tiles.forEach((layer, i) => maps[i].removeLayer(layer)), 0);
        notice('The background map could not load. Tile loading has stopped; the routes remain visible. Check your internet connection, provider permissions or usage limits before reloading.');
      };
      maps.forEach(map => {
        const layer = L.tileLayer(url, {
          attribution, maxZoom: 19, tileSize: 256, opacity: .72,
          referrerPolicy: 'strict-origin-when-cross-origin',
          updateWhenIdle: true, updateWhenZooming: false, keepBuffer: 1,
          detectRetina: false
        });
        layer.on('tileerror', stop);
        tiles.push(layer);
        layer.addTo(map);
        if (config.provider === 'maptiler') {
          const logo = L.control({position: 'bottomleft'});
          logo.onAdd = () => {
            const a = L.DomUtil.create('a');
            a.href = 'https://www.maptiler.com/'; a.target = '_blank'; a.rel = 'noopener';
            a.innerHTML = '<img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler" style="width:88px;background:white;padding:3px">';
            L.DomEvent.disableClickPropagation(a);
            return a;
          };
          logo.addTo(map);
        }
      });
      window.expressBasemapLayers = tiles;
    }
  };
})();
