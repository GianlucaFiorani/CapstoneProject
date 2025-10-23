import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Dropdown, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./HorizontalScroll.css";
import ReviewsArea from "./review/ReviewsArea";
import PrintRating from "./review/PrintRating";
import PlayerCheck from "./players/PlayerCheck";
import bounce from "../../assets/img/bounce.gif";
import airball from "../../assets/img/airball.png";
import { jwtDecode } from "jwt-decode";
import { BsPeopleFill, BsThreeDots } from "react-icons/bs";
import ReportModal from "./ReportModal";
import { useDispatch } from "react-redux";
import { fetchCourtsAction, resetCourtsAction, searchAction } from "../../redux/action";

const CourtDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [court, setCourt] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [toDeleteOrEdit, setToDeleteOrEdit] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [players, setPlayers] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const navigate = useNavigate();

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
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const checkIn = (courtId) => {
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
    try {
      const response = await fetch("http://localhost:3001/checkins/checkout", {
        method: "PUT",
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
          dispatch(fetchCourtsAction(token, setLoading));
          fetchAndCheckPresence(params.id);
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
      if (!response.ok) {
        throw new Error("Errore nell'eliminazione del campo");
      }
      dispatch(searchAction(null, null));
      navigate("/");
      dispatch(resetCourtsAction());
    } catch (error) {
      setError(error.message);
    } finally {
      setShowModal(false);
      setLoading(false);
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
        overflowX: "hidden",
        position: "fixed",
      }}
    >
      <ReportModal showModal={showReport} setShowModal={setShowReport} />

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
            <Dropdown.Item
              onClick={() => {
                setShowReport(true);
              }}
            >
              Segnala
            </Dropdown.Item>
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
        <h2 className="d-flex mt-3 ">
          <div className="d-flex">
            <span className="fs-5">{court.ratingAv ? court.ratingAv : 0}</span>
            <span className="fs-6 me-2">/5</span>
          </div>
          <div className="align-items-center">
            <PrintRating ratingAv={court.ratingAv ? court.ratingAv : 0} size={"20px"} translate={"-12px"} />
          </div>
          <span className="fs-6 text-secondary ms-2">{"(" + (court.reviewCount ? court.reviewCount : 0) + ")"}</span>
        </h2>
        <div className="d-flex">
          <Button
            className="border-c2 border-3 fw-bold"
            style={{ background: "#ffb114", color: "#795548 " }}
            onClick={() => (isPresent ? checkOut(court.id) : checkIn(court.id))}
          >
            {isPresent ? "checkout" : "checkin"}
          </Button>
          <span className="ms-auto me-3 fw-bold fs-2">
            <BsPeopleFill />
            {players.length}
          </span>
        </div>
      </div>

      <div className="scroll-container">
        <div className="page page1">
          <ReviewsArea fetchCourt={fetchCourt} />
        </div>
        <div className="page page2">
          <PlayerCheck isPresent={isPresent} />
        </div>
        <div className="page page3">Coming soon ...</div>
      </div>
    </div>
  );
};
export default CourtDetails;
