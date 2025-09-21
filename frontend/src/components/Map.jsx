import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SingleMarker from "./SingleMarker";

const Map = ({ courts }) => {
  const center = courts.length > 0 ? [courts[0].lat, courts[0].lon] : [45.4642, 9.19];
  return (
    <MapContainer center={center} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {courts.map((court) => (
        <SingleMarker key={court.id} court={court} />
      ))}
    </MapContainer>
  );
};

export default Map;
