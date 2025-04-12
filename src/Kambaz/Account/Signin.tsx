import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (error: any) {
      alert(error.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <input
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="form-control mb-2"
        placeholder="Username"
      />
      <input
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="form-control mb-2"
        type="password"
        placeholder="Password"
      />
      <button onClick={signIn} className="btn btn-primary w-100">
        Sign in
      </button>
      <Link to="/Kambaz/Account/Signup"> Sign up </Link>
    </div>
  );
}
