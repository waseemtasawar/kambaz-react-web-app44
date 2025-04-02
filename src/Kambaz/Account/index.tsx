import { Routes, Route, Navigate } from "react-router-dom";
import AccountNavigation from "./Navigation";
import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";

export default function Account() {
  return (
    <div id="wd-account-screen">
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <AccountNavigation />
            </td>
            <td valign="top">
              <Routes>
                <Route path="/" element={<Navigate to="/Kambaz/Account/Signin" />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Profile" element={<Profile />} />
              </Routes>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
