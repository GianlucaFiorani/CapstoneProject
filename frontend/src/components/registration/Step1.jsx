import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { isValidEmail } from "../../utils/isValidEmail";
import { Link } from "react-router-dom";

const Step1 = ({ nextStep, handleChange, values }) => {
  const [exist, setExist] = useState(false);
  const [notMail, setNotMail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    isValidEmail(values.email)
      ? fetch("http://localhost:3001/auth/" + values.email, {})
          .then((res) => {
            if (!res.ok) throw new Error("Errore");
            return res.json();
          })
          .then((data) => {
            data ? (setExist(true), setNotMail(false)) : nextStep();
          })
      : (setNotMail(true), setExist(true));
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
    >
      <Form className="p-2 mt-5" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="fascinate-regular fs-4" style={{ color: "#795548" }}>
            Indirizzo e-mail
          </Form.Label>
          <Form.Control
            style={{ background: "#ffffff45" }}
            className={exist ? "border-danger border-0 shadow border-c2 p-2 mt-3" : "border-0 shadow border-c2 p-2 mt-3"}
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="nome@dominio.com"
            required
          />
        </Form.Group>
        <h6 className={exist ? "text-danger mt-2" : "d-none"}>{notMail ? "Questa e-mail non è valida" : "E-mail già esistente"}</h6>
        <Button style={{ width: "100%", backgroundColor: "#795548" }} className="rounded-pill my-2 border-0" onClick={handleSubmit}>
          Avanti
        </Button>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <h6 className="text-secondary">Hai già un account?</h6>
          <Link to={"/login"} className="text-decoration-none text-dark">
            Accedi
          </Link>
        </div>
      </Form>
    </Container>
  );
};

export default Step1;
