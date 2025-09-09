import { Container } from "react-bootstrap";

const Summary = ({ formData }) => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
    >
      <p className="mt-5 fw-semibold" style={{ width: "300px" }}>
        Abbiamo mandato una mail di conferma a {`${formData.email}`} clicca sul link per attivare il profilo
      </p>
    </Container>
  );
};

export default Summary;
