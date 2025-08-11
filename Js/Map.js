async function fetchJSON(path){ const r=await fetch(path); if(!r.ok) throw new Error(path); return r.json(); }

(async () => {
  // Basic map: World coordinates (swap to your own image tiles later if you like)
  const map = L.map('map', { zoomControl: true }).setView([51.505, -0.09], 6);

  // Free tiles to start; later you can switch to a custom image or map style
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  const [locations, current] = await Promise.all([
    fetchJSON('/data/locations.json'),
    fetchJSON('/data/current.json')
  ]);

  // Show current location badge
  document.getElementById('youAreHere').textContent = `You are here: ${current.name}`;

  // Plot markers
  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng]).addTo(map);
    marker.bindTooltip(loc.name, { permanent: false, direction: 'top' });
    marker.on('click', () => {
      const html = `
        <strong>${loc.name}</strong><br/>
        ${loc.summary || ''}<br/>
        ${loc.seen ? 'Visited ✅' : 'Unvisited ❌'}<br/>
        ${loc.link ? `<a href="${loc.link}" target="_blank" rel="noopener">Notes</a>` : ''}
      `;
      marker.bindPopup(html).openPopup();
    });
  });

  // Centre on current location
  const here = locations.find(l => l.id === current.id);
  if (here) map.setView([here.lat, here.lng], current.zoom || 8);
})();
