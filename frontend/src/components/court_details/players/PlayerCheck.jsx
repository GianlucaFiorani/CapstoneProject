import { useEffect, useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

const PlayerCheck = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [loadin, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const timeDiff = (checkin) => {
    const now = new Date();
    const checkinDate = new Date(checkin);
    const diff = Math.floor((now - checkinDate) / 60000);
    if (diff < 60) {
      return "rgb(16 169 98)";
    } else if (diff < 150) {
      return "rgb(242 226 10)";
    } else {
      return "rgb(228 0 0)";
    }
  };

  const fetchPlayers = () => {
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
      fetch("http://localhost:3001/checkins/" + params.id, {
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
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <>
      <div style={{ overflowY: "auto", height: "100vh", width: "100%" }}>
        {players.length == 0 ? (
          <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
            Nessun giocatore
          </div>
        ) : (
          <ListGroup style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingBottom: "250px" }}>
            {players.map((player) => (
              <ListGroup.Item
                key={player.id}
                className="d-flex flex-column shadow border-6 border-start-0 border-end-0 p-5 my-4"
                style={{ backgroundColor: "#f6f5f529", width: "450px", borderColor: timeDiff(player.timeCheckIn) }}
              >
                <div className="d-flex gap-2 align-items-center mb-2" style={{ marginLeft: "-122px" }}>
                  <img
                    src={player.user.avatar}
                    alt="avatar"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ width: "100%" }}>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold fs-3">
                        {player.user.name} {player.user.surname}
                      </span>
                      <span className="fs-6 fw-semibold ms-1 mt-0">@{player.user.username}</span>
                      <div className="fs-5">
                        <span className="me-1"> Ha fatto checkIn</span>
                        {formatDistanceToNow(new Date(player.timeCheckIn), {
                          addSuffix: true,
                          locale: it,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </>
  );
};
export default PlayerCheck;
