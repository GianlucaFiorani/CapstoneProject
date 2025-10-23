import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Dropdown, Modal, Form, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import bounce from "../../assets/img/bounce.gif";
import airball from "../../assets/img/airball.png";
import { jwtDecode } from "jwt-decode";
import ReportModal from "../court_details/ReportModal";
import { BsThreeDots } from "react-icons/bs";
import { BiUpload, BiXCircle } from "react-icons/bi";
import "./ProfileDetails.css";

const ProfileDetails = () => {
  const params = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingImg, setLoadingImg] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [exist, setExist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyUsername = async (identifier) => {
    try {
      const res = await fetch("http://localhost:3001/auth/" + identifier);
      if (!res.ok) throw new Error("Errore nel controllo utente");
      const data = await res.json();
      setExist(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUser = () => {
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
      fetch("http://localhost:3001/users/" + params.id, {
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
          setUser(data);
          setFormData({
            username: data.username,
            name: data.name,
            surname: data.surname,
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/" + params.id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Errore nell'eliminazione del campo");
      }
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const editUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/" + params.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchUser();
      } else {
        throw new Error("Errore nella modifica del profilo");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setOpenEdit(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage) {
      uploadAvatar();
    }
    if ((!exist || formData.username == user.username) && formData.name && formData.surname && formData.username) {
      editUser();
      setFormData({
        username: user.username,
        name: user.name,
        surname: user.surname,
      });
    }
  };

  const uploadAvatar = async () => {
    setLoadingImg(true);
    const formDataImg = new FormData();
    formDataImg.append("img", selectedImage);
    try {
      const response = await fetch("http://localhost:3001/users/avatar/upload", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataImg,
      });

      if (response.ok) {
        fetchUser();
      } else {
        throw new Error("Errore nella modifica del avatar");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setPreview(null);
      setSelectedImage(null);
      setLoadingImg(false);
    }
  };

  useEffect(() => {
    fetchUser();
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
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
        position: "fixed",
      }}
    >
      <ReportModal showModal={showReport} setShowModal={setShowReport} />

      <Modal
        show={openEdit}
        onHide={() => {
          setOpenEdit(false);
          setFormData({
            username: user.username,
            name: user.name,
            surname: user.surname,
          });
          setPreview(null);
          setSelectedImage(null);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="d-none" />
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="rounded-circle position-relative border-0 p-0"
              onClick={() => fileInputRef.current.click()}
              style={{ background: "#f0f8ff0a" }}
            >
              <img
                className="shadow mb-2"
                src={preview || user.avatar}
                alt="avatar"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  filter: isHovered && "brightness(50%)",
                }}
              />
              <div
                className={isHovered ? "position-absolute fs-1" : "d-none"}
                style={{ top: "46%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}
              >
                <BiUpload />
              </div>
            </Button>
            <div>
              <Form.Group className="mt-4 position-relative">
                <p className="fw-semibold position-absolute m-0 px-1" style={{ background: "antiquewhite", top: "-15px", left: "15px" }}>
                  Nome
                </p>
                <Form.Control
                  className="border-2 shadow-sm border-c2 py-2 px-3"
                  style={{ background: "antiquewhite" }}
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={`Inserisci nuovo nome`}
                />
              </Form.Group>
              <Form.Group className="mt-4 position-relative">
                <p className="fw-semibold position-absolute m-0 px-1" style={{ background: "antiquewhite", top: "-15px", left: "15px" }}>
                  Cognome
                </p>
                <Form.Control
                  className="border-2 shadow-sm border-c2 py-2 px-3"
                  style={{ background: "antiquewhite" }}
                  name="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder={`Inserisci nuovo cognome`}
                />
              </Form.Group>
              <Form.Group className="mt-4 position-relative">
                <p className="fw-semibold position-absolute m-0 px-1" style={{ background: "antiquewhite", top: "-15px", left: "15px" }}>
                  Username
                </p>
                <Form.Control
                  className="border-2 shadow-sm border-c2 py-2 px-3"
                  style={{ background: "antiquewhite" }}
                  name="username"
                  type="text"
                  value={formData.username}
                  onFocus={() => setExist(false)}
                  onBlur={() => formData.username && verifyUsername(formData.username)}
                  onChange={handleChange}
                  placeholder={`Inserisci nuovo username`}
                />
                {exist && formData.username != user.username && (
                  <p className="text-danger mt-1">
                    <BiXCircle />
                    Username già esistente
                  </p>
                )}
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            className="border-0"
            variant="secondary"
            onClick={() => {
              setOpenEdit(false);
              setFormData({
                username: user.username,
                name: user.name,
                surname: user.surname,
              });
              setPreview(null);
              setSelectedImage(null);
            }}
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            className={
              (!exist || formData.username == user.username) && formData.name && formData.surname && formData.username
                ? "bg-1 border-0"
                : "bg-light text-secondary border-0"
            }
            onClick={handleSubmit}
          >
            Modifica
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 "></Modal.Header>
        <Modal.Body className="fs-5 fw-semibold align-self-center py-1">Confermi eliminazione profilo?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-2 border-0">
          <Button
            className="py-1 px-5 border-0 text-black delete-button"
            style={{ background: "#f0d9bb" }}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Annulla
          </Button>
          <Button
            className="py-1 px-5 text-danger border-0 delete-button "
            style={{ background: "#f0d9bb" }}
            onClick={() => {
              deleteUser();
            }}
          >
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ width: "100%", height: "100vh" }}>
        <div className="p-4 m-3 position-relative rounded-4 d-flex align-items-center gap-4 shadow">
          <Dropdown className="position-absolute border-0 top-0 end-0 me-3 p-0">
            <Dropdown.Toggle className="fs-4 border-0 p-0 mb-5" variant="none" id="dropdown-basic">
              <BsThreeDots />
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow" style={{ background: "antiquewhite" }}>
              {params.id == "me" || decoded.role == "ADMIN" ? (
                <>
                  <Dropdown.Item
                    onClick={() => {
                      setOpenEdit(true);
                    }}
                  >
                    Modifica
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Elimina
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item
                    onClick={() => {
                      setShowReport(true);
                    }}
                  >
                    Segnala
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setShowReport(true);
                    }}
                  >
                    Blocca
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="position-relative" style={{ cursor: "pointer" }}>
            <img className="shadow avatar-img " onClick={() => setShow(true)} src={user.avatar} alt="avatar" />
            {loadingImg && <div className="loader-overlay"></div>}
          </div>
          <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
            <Modal.Body className="p-0 bg-dark">
              <img src={user.avatar} alt="fullscreen" style={{ width: "100%", height: "auto", display: "block" }} />
            </Modal.Body>
          </Modal>
          <div className="mt-3 text-center">
            <h4 className="fw-semibold profile-name mb-1">
              {user.name} {user.surname}
            </h4>
            <p className="text-muted profile-username">@{user.username}</p>
          </div>
        </div>
        <div className="px-3">
          <div className="stats-table-wrapper shadow">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Partita</th>
                  <th>PTS</th>
                  <th>REB</th>
                  <th>AST</th>
                  <th>STL</th>
                  <th>BLK</th>
                  <th>MIN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sapri</td>
                  <td>24</td>
                  <td>10</td>
                  <td>5</td>
                  <td>2</td>
                  <td>1</td>
                  <td>32</td>
                </tr>
                <tr>
                  <td>@ Sempione</td>
                  <td>18</td>
                  <td>7</td>
                  <td>9</td>
                  <td>1</td>
                  <td>0</td>
                  <td>29</td>
                </tr>
                <tr>
                  <td>Famagosta</td>
                  <td>31</td>
                  <td>11</td>
                  <td>4</td>
                  <td>3</td>
                  <td>2</td>
                  <td>35</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileDetails;
