import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  const fetchProfile = () => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
  };

  const signOut = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
          >
            {" "}
            Update{" "}
          </button>
          <input
            defaultValue={profile.username}
            id="wd-username"
            className="form-control mb-2"
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <input
            defaultValue={profile.password}
            id="wd-password"
            className="form-control mb-2"
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <input
            defaultValue={profile.firstName}
            id="wd-firstname"
            className="form-control mb-2"
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <input
            defaultValue={profile.lastName}
            id="wd-lastname"
            className="form-control mb-2"
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <input
            defaultValue={profile.dob}
            id="wd-dob"
            className="form-control mb-2"
            type="date"
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <input
            defaultValue={profile.email}
            id="wd-email"
            className="form-control mb-2"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <button onClick={signOut} className="btn btn-danger w-100 mb-2">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
