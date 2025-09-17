import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ center, zoom, markers }) {
  const [mapCenter, setMapCenter] = useState(center || [51.505, -0.09]);
  // Removed unused setMapZoom variable

  useEffect(() => {
    if (center) {
      setMapCenter(center);
    }
  }, [center]);

  return (
    <MapContainer center={mapCenter} zoom={zoom || 13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers && markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>
            {marker.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;