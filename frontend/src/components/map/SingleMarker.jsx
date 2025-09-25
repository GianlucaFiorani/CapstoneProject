import { useState } from "react";
import { Button } from "react-bootstrap";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import marker from "../../assets/img/marker.png";
import { jwtDecode } from "jwt-decode";
import PrintRating from "../PrintRating";

const SingleMarker = ({ court, go }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [players, setPlayers] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const customIcon = new L.Icon({
    iconUrl: marker,
    iconSize: [36, 43],
    iconAnchor: [16, 32],
    popupAnchor: [0, -40],
    shadowUrl: null,
  });

  const printRating = (ratingAv) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < ratingAv) {
        stars.push(
          <span key={i} className="text-primary">
            *
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-secondary">
            *
          </span>
        );
      }
    }
    return <>{stars}</>;
  };

  const fetchAndCheckPresence = (courtId) => {
    fetch("http://localhost:3001/checkins/" + courtId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore caricamento");
        return res.json();
      })
      .then((data) => {
        setPlayers(data);
        const currentUserId = decoded.sub;
        const isCheckedIn = data.some((player) => player.user.id === currentUserId);
        setIsPresent(isCheckedIn);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const checkIn = (courtId) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/checkins/" + courtId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore caricamento");
        return res.json();
      })
      .then(() => {
        fetchAndCheckPresence(courtId);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const checkOut = async (courtId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3001/checkins/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore caricamento");
      }

      fetchAndCheckPresence(courtId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Marker
      icon={customIcon}
      position={[court.lat, court.lon]}
      eventHandlers={{
        click: () => go([court.lat, court.lon]),
      }}
    >
      <Popup
        autoPan={false}
        eventHandlers={{
          add: () => fetchAndCheckPresence(court.id),
        }}
      >
        <Link to={"/court-details/" + court.id}> {court.name || "Basketball Court"}</Link>
        <h2 className="d-flex ">
          <span className="fs-6">{court.ratingAv + "/5"}</span>
          <div>
            <PrintRating ratingAv={court.ratingAv} size={"15px"} translate={"-12px"} />
          </div>
          <span className="fs-6 text-secondary">{"(" + court.reviewCount + ")"}</span>
        </h2>
        <Button onClick={() => (isPresent ? checkOut(court.id) : checkIn(court.id))}>{isPresent ? "checkout" : "checkin"}</Button>
        <span>{players.length}</span>
      </Popup>
    </Marker>
  );
};

export default SingleMarker;
