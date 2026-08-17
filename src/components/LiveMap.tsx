"use client";

import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IProps {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);
  return null;
}

function LiveMap({ userLocation, deliveryBoyLocation }: IProps) {
  // Icons inside component (client side boundary safeguard)
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });

  const hasDeliveryBoyLoc = deliveryBoyLocation && deliveryBoyLocation.latitude !== 0;
  const hasUserLoc = userLocation && userLocation.latitude !== 0;

  const center: [number, number] = hasDeliveryBoyLoc
    ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
    : [userLocation.latitude || 0, userLocation.longitude || 0];

  const linePosition =
    hasUserLoc && hasDeliveryBoyLoc
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow relative z-2">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <Recenter position={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasUserLoc && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>Delivery Address</Popup>
          </Marker>
        )}

        {hasDeliveryBoyLoc && (
          <Marker
            position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        {linePosition.length > 0 && <Polyline positions={linePosition as any} color="green" />}
      </MapContainer>
    </div>
  );
}

export default LiveMap;