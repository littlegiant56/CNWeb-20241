import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import user from "../assets/icons/user.png";
import { Link } from "react-router-dom";
import { getProfileByUserId } from "../services/API";

export default function ProfileCard() {
  const [profile, setProfile] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    // Fetch user profile from API
    getProfileByUserId(userId)
      .then((res) => {
        console.log("check profile", res.data);
        setProfile(res.data.user);
      })
      .catch((err) => {
        console.error("API error: ", err);
      });
  }, []);

  return (
    profile && (
      <Container>
        <Link
          className="d-flex  rounded-2"
          to={`/profile/${localStorage.getItem("userId")}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <Image
            className="border "
            src={profile.avatar}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: "1px solid black",
            }}
            roundedCircle
          />
          <h5
            className="align-self-center m-0 ms-2"
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {profile.firstName + " " + profile.lastName}
          </h5>
        </Link>
      </Container>
    )
  );
}
