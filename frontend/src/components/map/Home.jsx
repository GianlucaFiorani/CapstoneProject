import { useEffect, useState } from "react";
import { Container, Alert, Spinner, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import bounce from "../../assets/img/bounce.gif";
import airball from "../../assets/img/airball.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourtsAction } from "../../redux/action";

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const courts = useSelector((state) => state.courts.data);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
      courts.length == 0 ? dispatch(fetchCourtsAction(token, setLoading, setError)) : setLoading(false);
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
        className="text-center d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
          color: "#f1f1f1",
        }}
      >
        <div className="d-flex flex-column">
          <div>
            <img src={airball} alt="error 500" width={385} />
          </div>
          <h1 className="fascinate-regular text-black" style={{ fontSize: "4rem" }}>
            500
          </h1>
        </div>
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
