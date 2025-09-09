import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
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
    ></div>
  );
};

export default Home;
