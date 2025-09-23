import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import SingleMarker from "./SingleMarker";
import MapController from "./MapController";
import ZoomController from "./ZoomController";
import me from "../assets/img/me.png";
import AddCourt from "./svg/AddCourt";
import AddCourtHandler from "./AddCourtHandler";
import { BiCrosshair } from "react-icons/bi";
import { BsCrosshair } from "react-icons/bs";

const Map = ({ courts }) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [searchPosition, setSearchPosition] = useState(null);
  const [addCourt, setAddCourt] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(13);
  const center = userPosition ? userPosition : [45.4642, 9.19];

  const customIcon = new L.Icon({
    iconUrl: me,
    iconSize: [32, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -40],
    shadowUrl: null,
  });

  const handleSearch = async () => {
    if (!searchLocation) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/geocode/${searchLocation}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { lat, lon } = data[0];
        setSearchPosition([parseFloat(lat), parseFloat(lon)]);
      })
      .catch((err) => {
        console.error("Errore nella geocodifica:", err);
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Errore nel recupero della posizione:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocalizzazione non supportata dal tuo browser");
    }
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          setAddCourt(!addCourt);
        }}
        className="bg-1 border-0 position-absolute z-1000 end-0 bottom-0 rounded-pill p-0 mb-4 me-2"
        style={{ width: "70px", fill: "white" }}
      >
        <AddCourt />
      </Button>
      <Button
        onClick={() => {
          setSearchPosition([userPosition[0] - 0.00001, userPosition[1] - 0.00001]);
        }}
        className="bg-1 border-0 position-absolute z-1000 end-0 rounded-pill p-0 mb-5 me-2"
        style={{ width: "70px", height: "70px", bottom: "50px" }}
      >
        <BsCrosshair size={35} />
      </Button>
      <div className="mt-4 position-absolute z-1000">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center gap-5">
            <Form
              className="d-flex"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Form.Control
                type="text"
                placeholder={`Cerca qui`}
                className="me-2"
                onChange={(e) => {
                  setSearchLocation(e.target.value);
                }}
              />
            </Form>
          </div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoomLevel}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        {addCourt && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(255, 183, 0, 0.11)",
              pointerEvents: "none",
              zIndex: 400,
            }}
          />
        )}
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <MapController position={searchPosition || userPosition} />
        <ZoomController onZoomChange={setZoomLevel} />
        {addCourt && <AddCourtHandler go={setSearchPosition} />}
        {zoomLevel >= 12 && courts.map((court) => <SingleMarker key={court.id} court={court} go={setSearchPosition} />)}

        {userPosition && <Marker position={userPosition} icon={customIcon}></Marker>}
      </MapContainer>
    </>
  );
};

export default Map;
