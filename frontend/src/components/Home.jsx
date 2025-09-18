import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Map from "./Map";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courts, setCourts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
      fetch("http://localhost:3001/courts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore caricamento Fatture");
          return res.json();
        })
        .then((data) => {
          setCourts(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
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
        <Spinner className="mt-5" animation="border" variant="danger" />
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
        display: "flex",
        justifyContent: "center",
        overflowX: "hidden",
      }}
    >
      <Map courts={courts} />
    </div>
  );
};

export default Home;
