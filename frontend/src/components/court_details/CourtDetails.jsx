import { useParams } from "react-router-dom";
import { Alert, Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./HorizontalScroll.css";
import ReviewsArea from "./review/ReviewsArea";
import PrintRating from "./review/PrintRating";
import PlayerCheck from "./players/PlayerCheck";
import bounce from "../../assets/img/bounce.gif";

const CourtDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [court, setCourt] = useState();

  const fetchCourt = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
      fetch("http://localhost:3001/courts/" + params.id, {
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
          setCourt(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchCourt();
  }, []);

  if (loading) {
    return (
      <Container
        fluid
        className="text-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
          color: "#f1f1f1",
        }}
      >
        <div className="d-flex justify-content-center" style={{ width: "100%", height: "100vh" }}>
          <img
            src={bounce}
            alt="bounce"
            style={{
              width: "800px",
              objectFit: "cover",
            }}
          />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="mt-5"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
        }}
      >
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
        overflowX: "hidden",
        position: "fixed",
      }}
    >
      <div className="p-3  shadow">
        <h1 className="fascinate-regular fs-3 ">{court.name}</h1>
        <PrintRating ratingAv={court.ratingAv} size={"20px"} />
      </div>

      <div className="scroll-container">
        <div className="page page1">
          <ReviewsArea />
        </div>
        <div className="page page2">
          <PlayerCheck />
        </div>
        <div className="page page3">Coming soon ...</div>
      </div>
    </div>
  );
};
export default CourtDetails;
