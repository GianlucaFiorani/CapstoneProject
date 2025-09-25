import { useState } from "react";
import { Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import marker from "../../assets/img/marker.png";
import { Button, Form, Spinner } from "react-bootstrap";
import SingleMarker from "./SingleMarker";
import { data } from "react-router-dom";

const AddCourtHandler = ({ go }) => {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCourt, setNewCourt] = useState([]);

  const customIcon = new L.Icon({
    iconUrl: marker,
    iconSize: [36, 43],
    iconAnchor: [16, 32],
    popupAnchor: [0, -40],
    shadowUrl: null,
  });

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setClickedPosition([lat, lng]);

      const token = localStorage.getItem("token");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clickedPosition) {
      setError("Errore");
    } else {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3001/courts", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name, lat: clickedPosition[0], lon: clickedPosition[1] }),
        });

        if (!response.ok) {
          throw new Error("Errore");
        }

        const data = await response.json();
        newCourt.push(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setClickedPosition(null);
      }
    }
  };

  return (
    <>
      {clickedPosition && (
        <Marker
          position={clickedPosition}
          icon={customIcon}
          eventHandlers={{
            click: () => go(clickedPosition),
          }}
        >
          <Popup>
            {loading ? (
              <Spinner className="mt-5" animation="border" variant="danger" />
            ) : (
              <>
                <h6>Aggiungi il nome del campo</h6>
                <div className="mt-0" style={{ width: "250px" }}>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <Form className="d-flex" onSubmit={handleSubmit}>
                        <Form.Control
                          type="text"
                          placeholder={`Inserisci nome`}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        <Button type="submit" className="bg-1 border-0">
                          invia
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Popup>
        </Marker>
      )}

      {newCourt && newCourt.map((court) => <SingleMarker key={court.id} court={court} go={go} />)}
    </>
  );
};

export default AddCourtHandler;
