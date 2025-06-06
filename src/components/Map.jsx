/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, TileLayer, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import useGeolocation from "../hooks/UseGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/UseUrlPositon";

export default function Map() {
  const navigate = useNavigate();
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {isLoading: isLoadingPosition, position: geolocationPosition, getPosition} = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(function () {
    if (mapLat && mapLng) setMapPosition([+mapLat, +mapLng]);
  }, [mapLat, mapLng]);

  useEffect(function () {
    if (geolocationPosition?.lat != null && geolocationPosition?.lng != null) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  return (
<div className={styles.mapContainer} onClick={(e) => {
  if (e.target === e.currentTarget) navigate("form");
}}>
      {geolocationPosition && (
        <Button
        type="position"
        onClick={() => {
          getPosition(); // Panggil fungsi geolocation
          if (geolocationPosition?.lat && geolocationPosition?.lng) {
            navigate(`form?lat=${geolocationPosition.lat}&lng=${geolocationPosition.lng}`);
          }
        }}
      >
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>
      
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition}/>
        <DetectClick/>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({position}) {
  const map = useMap();
  map.setView(position);
  return null
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  });
}

