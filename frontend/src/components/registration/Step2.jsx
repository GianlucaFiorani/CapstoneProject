import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/isValidEmail";
import { isValidPassword } from "../../utils/isValidPassword";

const Step2 = ({ nextStep, handleChange, values }) => {
  const hasUpperAndLower = /[A-Z]/.test(values.password) && /[a-z]/.test(values.password);
  const hasNumber = /\d/.test(values.password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(values.password);
  const hasLength = values.password.length >= 8;
  const [hasSubmit, SetHasSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    !isValidEmail(values.email) && navigate("/login");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    isValidPassword(values.password) ? nextStep() : SetHasSubmit(true);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
    >
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control className={hasSubmit ? "border-danger" : ""} type="password" name="password" value={values.password} onChange={handleChange} required />
        </Form.Group>
        <h6 className="my-4">La password deve contenere almeno</h6>
        <p className={hasUpperAndLower ? "text-success" : hasSubmit ? "text-danger" : ""}>1 lettera maiuscola e 1 lettera minuscola</p>
        <p className={hasNumber ? "text-success" : hasSubmit ? "text-danger" : ""}>1 numero</p>
        <p className={hasSpecial ? "text-success" : hasSubmit ? "text-danger" : ""}>1 numero o carattere speciale (ad esempio: # ? ! &)</p>
        <p className={hasLength ? "text-success" : hasSubmit ? "text-danger" : ""}>8 caratteri</p>
        <Button style={{ width: "100%", backgroundColor: "#795548" }} className="rounded-pill my-2 border-0" onClick={handleSubmit}>
          Avanti
        </Button>
      </Form>
    </Container>
  );
};

export default Step2;
