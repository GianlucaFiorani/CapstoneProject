import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/isValidEmail";
import { isValidPassword } from "../../utils/isValidPassword";

const Step3 = ({ formData, nextStep, handleChange, values }) => {
  const [exist, setExist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (!isValidEmail(values.email) || !isValidPassword(values.password)) && navigate("/login");
  }, []);

  const handleSubmit = () => {
    values.name &&
      values.surname &&
      fetch("http://localhost:3001/auth/" + values.username, {})
        .then((res) => {
          if (!res.ok) throw new Error("Errore");
          return res.json();
        })
        .then((data) => {
          data
            ? setExist(true)
            : fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              })
                .then((res) => res.json())
                .then((data) => console.log(data), nextStep())
                .catch((err) => console.error("Error:", err));
        });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
    >
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Inserisci nome" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control type="text" name="surname" value={values.surname} onChange={handleChange} placeholder="Inserisci cognome" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            className={exist ? "border-danger" : ""}
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            placeholder="Inserisci username"
            required
          />
          <h6 className={exist ? "text-danger" : "d-none"}>Username già esistente</h6>
        </Form.Group>

        <Button style={{ width: "100%", backgroundColor: "#795548" }} className="rounded-pill my-2 border-0" onClick={handleSubmit}>
          Iscriviti
        </Button>
      </Form>
    </Container>
  );
};

export default Step3;
