import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const Verify = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    fetch("http://localhost:3001/auth/verify?token=" + token, {})
      .then((res) => {
        if (!res.ok) throw new Error("Errore");
        navigate("/login");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
      >
        <Spinner animation="border" variant="danger" />
        <h2 className="mt-5 fw-semibold" style={{ width: "300px" }}>
          Verifica in corso ...
        </h2>
      </Container>
    );
  }
  if (error) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
      >
        <h2 className="mt-5 fw-semibold" style={{ width: "300px" }}>
          Erroe
        </h2>
      </Container>
    );
  }
};
export default Verify;
