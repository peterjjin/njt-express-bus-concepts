/* Route-wide historical ridership, attached only to reviewed P&R sites. */
(() => {
  'use strict';
  const data = window.PR_CALLOUT_DATA;
  if (!data) return;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = value => value === null ? 'N/A' : value.toLocaleString('en-US',{maximumFractionDigits:1,minimumFractionDigits:1});
  const exit9 = DATA.stops.some(s => s.properties.id === 'amc') ? 'mary' : 'neilson';
  const groups = ['NJ TRANSIT','University / local buses','Commuter / longer-distance buses'];
  const sourceHref = '../pr-callout-data.json';
  const sheetRef = row => ['Weekday','Saturday','Sunday'].filter(day => row.source_ranges[day]).map(day => day+': '+row.source_ranges[day]).join('; ');
  function contents(id) {
    const site = data.sites[id];
    let html = '<div class="pr-ridership-date">May 2024 · average riders/day, entire route</div>';
    html += '<p class="pr-scope">Not site boardings or projected express-bus demand. N/A = not supplied, not zero or proof of no service.</p>';
    if(site.review_note) html += '<details class="pr-sources"><summary>Downtown service verification notes</summary><p>'+escape(site.review_note)+'</p></details>';
    html += '<div class="pr-table-scroll" tabindex="0" aria-label="Bus routes and ridership; scroll for all services">';
    for (const group of groups) {
      const rows = site.routes.filter(row => row.group === group);
      html += '<h4>'+escape(group)+'</h4>';
      if (!rows.length) { html += '<p class="pr-no-service">No service identified in this screening.</p>'; continue; }
      html += '<table><thead><tr><th scope="col">Operator / route</th><th scope="col">Weekday</th><th scope="col">Sat</th><th scope="col">Sun</th></tr></thead><tbody>';
      for (const row of rows) {
        const operator = row.feed === 'njt' ? 'NJT' : row.operator;
        const access = row.shuttle_needed ? 'Local shuttle needed' : row.access;
        const distance = row.straight_line_miles===null?'Exact curb distance not verified':row.straight_line_miles.toFixed(2)+' mi to nearest stop (straight-line)';
        html += '<tr><th scope="row"><span class="pr-operator">'+escape(operator)+'</span> '+escape(row.route)+'</th>';
        for (const day of ['Weekday','Saturday','Sunday']) html += '<td title="'+escape(day+(row.source_ranges[day]?' · '+data.source_sheet+'!'+row.source_ranges[day]:' · Ridership not supplied'))+'">'+number(row.ridership[day])+'</td>';
        html += '</tr><tr class="pr-access-row"><td colspan="4"><span class="'+(row.shuttle_needed?'pr-shuttle':'pr-direct')+'">'+escape(access)+'</span><details><summary>Stop / source details</summary><p>'+escape(row.stop)+'<br>'+escape(distance)+'</p><p>'+escape(row.note)+'</p><p><a href="'+escape(row.service_url)+'" target="_blank" rel="noopener">'+escape(row.service_source)+'</a></p><p>'+escape(sheetRef(row)||'Ridership unavailable in the supplied workbook.')+'</p></details></td></tr>';
      }
      html += '</tbody></table>';
    }
    html += '</div><details class="pr-sources"><summary>Coverage and ridership source</summary><p>'+escape(data.coverage_note)+'</p><p>'+escape(data.source_workbook)+' · '+escape(data.source_sheet)+'. Ridership is May 2024; the stop screening uses September 2026 sources. Missing weekend rows do not establish weekend service availability.</p><a href="'+sourceHref+'" target="_blank">Reviewed site / route data</a></details>';
    return html;
  }
  const style = document.createElement('style');
  style.textContent = `.pr-panel{width:335px;max-width:calc(100vw - 70px);background:#fffffff5;color:#203340;border:1px solid #8296a3;border-radius:4px;box-shadow:0 2px 8px #20334028;font:13px/1.4 'Segoe UI',Arial,sans-serif}.pr-panel>summary{cursor:pointer;padding:8px 10px;font-weight:700;background:#e9eff2}.pr-panel label{display:block;padding:8px 10px 0}.pr-panel select{display:block;width:100%;font:600 13px 'Segoe UI',Arial,sans-serif;padding:6px;margin-top:4px;border:1px solid #9aabb6;background:white;color:#203340}.pr-panel-body{padding:8px 10px}.pr-ridership-date{font-weight:700;color:#254a60;font-size:12px}.pr-scope{font-size:12px;line-height:1.35;margin:5px 0 8px!important}.pr-table-scroll{max-height:225px;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable}.pr-table-scroll h4{font-size:13px;margin:8px 0 4px;border-bottom:2px solid #9aaeba;padding-bottom:3px}.pr-table-scroll table{width:100%;border-collapse:collapse;font-size:12px;table-layout:fixed}.pr-table-scroll th,.pr-table-scroll td{padding:4px 2px;text-align:right;vertical-align:top}.pr-table-scroll th:first-child{width:44%;text-align:left}.pr-table-scroll thead{color:#4c6371;font-size:11px}.pr-table-scroll thead th:first-child{width:44%}.pr-table-scroll tbody>tr:not(.pr-access-row){background:#eef3f5}.pr-table-scroll tbody th{font-size:13px}.pr-access-row td{text-align:left;padding-bottom:8px;border-bottom:1px solid #d5dfe4}.pr-access-row summary{cursor:pointer;color:#446477;font-size:11px}.pr-access-row p{margin:5px 0!important}.pr-shuttle{color:#8a5100;font-size:11px;font-weight:650}.pr-direct{color:#23634b;font-size:11px;font-weight:650}.pr-operator{font-size:11px;font-weight:500}.pr-no-service{font-size:12px;margin:4px 0 8px!important;color:#526873}.pr-sources{font-size:11px;margin-top:7px}.pr-sources summary{cursor:pointer}.pr-sources p{margin:5px 0!important}.pr-tooltip-hint{display:block;font-size:10px;font-weight:400;color:#28627c}.pr-popup{font:13px/1.4 'Segoe UI',Arial,sans-serif}.pr-popup h3{margin:0 0 6px;font-size:15px}.pr-popup .pr-table-scroll{max-height:230px}.pr-panel a,.pr-popup a{color:#18577c}.pr-panel select:focus-visible,.pr-panel summary:focus-visible,.pr-table-scroll:focus-visible{outline:2px solid #087c91;outline-offset:2px}@media(max-width:650px){.pr-panel{width:290px}.pr-table-scroll{max-height:160px}.pr-panel-body{padding:7px}.pr-panel .pr-scope{font-size:11px}}`;
  document.head.appendChild(style);
  let selection = 'stadium';
  const panel = L.control({position:'bottomright'});
  let select, body;
  panel.onAdd = () => {
    const el = L.DomUtil.create('details','pr-panel');
    el.open = innerWidth >= 900;
    el.innerHTML = '<summary>Bus connections & ridership</summary><label>Concept stop / park-and-ride site<select aria-label="Bus connections site"></select></label><div class="pr-panel-body"></div>';
    select = el.querySelector('select'); body = el.querySelector('.pr-panel-body');
    select.onchange = () => {selection=select.value;body.innerHTML=contents(selection);};
    L.DomEvent.disableClickPropagation(el); L.DomEvent.disableScrollPropagation(el);
    return el;
  };
  panel.addTo(maps[0]);
  function update() {
    const sites = view==='c1'?['stadium','helix',exit9]:view==='c2'?['8a',exit9]:view==='c3'?['molly','8a',exit9]:['stadium','helix','8a','molly',exit9];
    if (!sites.includes(selection)) selection=sites[0];
    select.innerHTML = sites.map(id => {
      const optional = (id===exit9&&['c2','c3'].includes(view))||(id==='8a'&&view==='c3');
      return '<option value="'+id+'">'+escape(data.sites[id].name)+(optional?' · optional pickup':'')+'</option>';
    }).join('');
    select.value=selection;body.innerHTML=contents(selection);
    // Enrich existing stop markers without adding, moving, or changing any route geometry.
    layers.forEach(group => group.eachLayer(marker => {
      if (!(marker instanceof L.CircleMarker)) return;
      const latlng=marker.getLatLng();
      const feature=DATA.stops.find(s => Math.abs(s.geometry.coordinates[0]-latlng.lng)<.000001&&Math.abs(s.geometry.coordinates[1]-latlng.lat)<.000001);
      const id=feature?.properties.id==='amc'?'mary':feature?.properties.id;
      if (!data.sites[id]) return;
      marker.bindPopup('<section class="pr-popup"><h3>'+escape(data.sites[id].name)+'</h3><p>'+escape(feature.properties.note||'')+'</p>'+contents(id)+'</section>',{maxWidth:350,minWidth:250,autoPan:true});
      const tooltip=marker.getTooltip();
      if(tooltip) marker.setTooltipContent(tooltip.getContent()+'<span class="pr-tooltip-hint">Click for buses & ridership</span>');
    }));
  }
  const previousDraw=draw;
  draw=function(){previousDraw();update();};
  // Some previous controls hold the old function reference; wire only redraw inputs.
  ['optional','optional-8a','reference'].forEach(id=>{const input=document.getElementById(id);if(input)input.onchange=draw;});
  update();
  window.prConnections={data,contents,update};
})();
