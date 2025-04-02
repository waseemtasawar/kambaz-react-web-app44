import  { useState } from "react";
export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div>
      <h2>String State Variables</h2>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    </div>
  );
}