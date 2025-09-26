import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/isValidEmail";
import { isValidPassword } from "../../utils/isValidPassword";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Step2 = ({ nextStep, handleChange, values }) => {
  const hasUpperAndLower = /[A-Z]/.test(values.password) && /[a-z]/.test(values.password);
  const hasNumber = /\d/.test(values.password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(values.password);
  const hasLength = values.password.length >= 8;
  const [hasSubmit, SetHasSubmit] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
        <Form.Group className="position-relative">
          <Form.Label className="fascinate-regular fs-4" style={{ color: "#795548" }}>
            Password
          </Form.Label>
          <Form.Control
            style={{ background: "#ffffff45" }}
            className={hasSubmit ? "border-danger shadow  p-2 mt-3" : "border-0 shadow border-c2 p-2 mt-3"}
            type={showPassword ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
          <Button
            type="button"
            className="border-0 position-absolute end-0 fs-3 p-0 pe-2"
            style={{ background: "#f9f9f903", color: "#795548", top: "55px" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BsEye /> : <BsEyeSlash />}
          </Button>
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
