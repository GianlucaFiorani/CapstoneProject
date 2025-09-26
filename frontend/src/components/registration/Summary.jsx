import { Container } from "react-bootstrap";

const Summary = ({ formData }) => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)" }}
    >
      <p className=" fs-4 shadow-lg fw-semibold p-4 mt-5" style={{ color: "#654f47ff", width: "300px", fontFamily: "monospace", borderRadius: "15px" }}>
        Abbiamo mandato una mail di conferma a {`${formData.email}`} clicca sul link per attivare il profilo
      </p>
    </Container>
  );
};

export default Summary;
