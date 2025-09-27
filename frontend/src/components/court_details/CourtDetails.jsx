import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Dropdown, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./HorizontalScroll.css";
import ReviewsArea from "./review/ReviewsArea";
import PrintRating from "./review/PrintRating";
import PlayerCheck from "./players/PlayerCheck";
import bounce from "../../assets/img/bounce.gif";
import { jwtDecode } from "jwt-decode";
import { BsThreeDots } from "react-icons/bs";

const CourtDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [court, setCourt] = useState();
  const [showModal, setShowModal] = useState(false);
  const [toDeleteOrEdit, setToDeleteOrEdit] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const navigate = useNavigate();

  const fetchCourt = () => {
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
          setNewName(data.name);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  const deleteCourt = async () => {
    try {
      const response = await fetch("http://localhost:3001/courts/" + toDeleteOrEdit, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/");
      } else {
        throw new Error("Errore nel eliminazione del campo");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setShowModal(false);
    }
  };

  const editCourt = async () => {
    try {
      const response = await fetch("http://localhost:3001/courts/" + toDeleteOrEdit, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, lat: court.lat, lon: court.lon }),
      });

      if (response.ok) {
        fetchCourt();
      } else {
        throw new Error("Errore nella modifica del nome");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setOpenEdit(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName) {
      editCourt();
      setNewName("");
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
      <Modal
        show={openEdit}
        onHide={() => {
          setOpenEdit(false);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mt-3">
              <p className="fw-semibold fs-5">Inserisci nuovo nome</p>
              <Form.Control
                className="border-0 shadow border-c2 p-2 "
                style={{ background: "#ffffff45" }}
                type="text"
                value={newName}
                placeholder={`Inserisci nuovo nome`}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            className="border-0"
            variant="secondary"
            onClick={() => {
              setOpenEdit(false);
            }}
          >
            Annulla
          </Button>
          <Button variant="primary" className={newName ? "bg-1 border-0" : "bg-light text-secondary border-0"} onClick={handleSubmit}>
            Modifica
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setToDeleteOrEdit(null);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 "></Modal.Header>
        <Modal.Body className="fs-5 fw-semibold align-self-center py-1">Confermi eliminazione campo?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-2 border-0">
          <Button
            className="py-1 px-5 border-0 text-black delete-button"
            style={{ background: "#f0d9bb" }}
            onClick={() => {
              setShowModal(false);
              setToDeleteOrEdit(null);
            }}
          >
            Annulla
          </Button>
          <Button
            className="py-1 px-5 text-danger border-0 delete-button "
            style={{ background: "#f0d9bb" }}
            onClick={() => {
              deleteCourt();
            }}
          >
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="p-3  shadow">
        <Dropdown className="position-absolute border-0 top-0 end-0 me-3 p-0">
          <Dropdown.Toggle className="fs-4 border-0 p-0 mb-5" variant="none" id="dropdown-basic">
            <BsThreeDots />
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow" style={{ background: "antiquewhite", zIndex: "9999" }}>
            <Dropdown.Item href="#/action-1">Segnala</Dropdown.Item>
            {(court.createBy.id == decoded.sub || decoded.role == "ADMIN") && (
              <>
                <Dropdown.Item
                  onClick={() => {
                    setToDeleteOrEdit(court.id);
                    setNewName(court.name);
                    setOpenEdit(true);
                  }}
                >
                  Modifica nome
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setToDeleteOrEdit(court.id);
                    setShowModal(true);
                  }}
                >
                  Elimina
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>

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
