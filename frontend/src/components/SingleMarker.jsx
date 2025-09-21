import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const SingleMarker = ({ court }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [players, setPlayers] = useState([]);

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
    const token = localStorage.getItem("token");
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
        const currentUserId = localStorage.getItem("userId");
        console.log(currentUserId);
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
    <Marker position={[court.lat, court.lon]}>
      <Popup
        eventHandlers={{
          add: () => fetchAndCheckPresence(court.id),
        }}
      >
        {court.name || "Basketball Court"}
        <h2 className="d-flex ">
          <span className="fs-6">{court.ratingAv + "/5"}</span>
          <div>{printRating(court.ratingAv)}</div>
          <span className="fs-6 text-secondary">{"(" + court.reviewCount + ")"}</span>
        </h2>
        <Button onClick={() => (isPresent ? checkOut(court.id) : checkIn(court.id))}>{isPresent ? "checkout" : "checkin"}</Button>
        <span>{players.length}</span>
      </Popup>
    </Marker>
  );
};

export default SingleMarker;
