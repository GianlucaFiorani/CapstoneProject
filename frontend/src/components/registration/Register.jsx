import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Summary from "./Summary";
import Step3 from "./Step3";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    surname: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  switch (step) {
    case 1:
      return <Step1 nextStep={nextStep} handleChange={handleChange} values={formData} />;
    case 2:
      return <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />;
    case 3:
      return <Step3 formData={formData} nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />;
    case 4:
      return <Summary formData={formData} />;
    default:
      return <h1>Qualcosa è andato storto</h1>;
  }
};

export default Register;
