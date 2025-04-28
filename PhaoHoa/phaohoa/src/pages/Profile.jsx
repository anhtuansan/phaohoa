// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api"; // API để lấy thông tin profile

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getProfile(token);
        setProfile(response);
        console.log(response);
      } catch (error) {
        setError("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div>
      <h2>Profile</h2>
      {error && <p>{error}</p>}
      {profile ? (
        <div>
          <p>Email: {profile.user.email}</p>
          {/* Các thông tin khác từ profile */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
