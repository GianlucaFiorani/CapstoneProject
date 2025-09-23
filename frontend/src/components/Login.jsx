import { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        throw new Error("Credenziali errate o errore di connessione");
      }

      const data = await response.json();
      console.log("Risposta login:", data);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userId", data.userId);
      setSuccess("Login effettuato con successo!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="p-4 shadow-lg border-0 rounded-4" style={{ backgroundColor: "#2c2f3b00" }}>
              <Card.Body>
                <img src={logo} alt="Spotify Logo" />

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Indirizzo e-mail o username</Form.Label>
                    <Form.Control placeholder="Inserisci la tua e-mail o username" value={identifier} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Inserisci la password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>

                  <div className="d-grid mb-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="py-2 fs-5 rounded-pill fw-semibold"
                      style={{ backgroundColor: "#795548", border: "none", color: "#ffffff" }}
                    >
                      {loading ? "Caricamento..." : "Accedi"}
                    </Button>
                  </div>

                  <div className="text-center">
                    <Link to={"/register"} className="text-decoration-none" style={{ color: "#5a5a5aff" }}>
                      Registrati ora
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
