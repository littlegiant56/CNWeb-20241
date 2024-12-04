import React, { useState } from "react";
import { Container, Row, Col, NavDropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfileByUserId } from "../services/API";
import {
  faEnvelope,
  faBell,
  faPlay,
  faPlusSquare,
  faHeart,
  faUserFriends,
  faUser,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo2.jpg";
import { socket } from "../socket";
import SearchBar from "./SearchBar";

export default function NavBar({
  doesNotificationContainerOpen,
  setDoesNotificationContainerOpen,
  doseMessageListOpen,
  setDoseMessageListOpen,
}) {
  const navigate = useNavigate();

  const [selectedIcon, setSelectedIcon] = useState("home");

  const [profile, setProfile] = useState();

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    getProfileByUserId(userId)
      .then((res) => setProfile(res.data.user))
      .catch((err) => console.error("API error: ", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    socket.disconnect();
    navigate("/login");
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(icon === selectedIcon ? null : icon);
  };

  const handleToProfile = () => {
    navigate(`/profile/${localStorage.getItem("userId")}`);
  };

  const iconStyle = (icon) => ({
    fontSize: "25px",
    color: selectedIcon === icon ? "blue" : "black",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.3s ease",
    padding: "10px",
    borderRadius: "50%", // Hình tròn bao quanh khi hover
    backgroundColor: selectedIcon === icon ? "#e6f7ff" : "transparent",
  });

  const iconHoverStyle = (e, isHover) => {
    e.currentTarget.style.transform = isHover ? "scale(1.2)" : "scale(1)";
    e.currentTarget.style.backgroundColor = isHover
      ? "#e6f7ff"
      : selectedIcon === e.currentTarget.dataset.icon
      ? "#e6f7ff"
      : "transparent";
  };

  return (
    <Container
      className="p-2 border-bottom sticky-top"
      fluid
      style={{
        backgroundColor: "#e0e0e0",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row className="align-items-center">
        <Col className="col-3 d-flex align-items-center">
          <Link
            className="me-0"
            to={"/"}
            style={{ backgroundColor: "#e0e0e0" }}
          >
            <div
              style={{
                backgroundColor: "#e0e0e0", // Màu nền bạn muốn
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center", // Canh giữa theo chiều dọc
                justifyContent: "center", // Canh giữa theo chiều ngang
                borderRadius: "50%", // Nếu muốn làm tròn nền ảnh
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover", // Đảm bảo ảnh không bị méo
                  borderRadius: "50%", // Làm tròn ảnh nếu muốn
                }}
              />
            </div>
          </Link>
          <SearchBar />
        </Col>
        <Col className="col-6 d-flex justify-content-center gap-4">
          <Link to={`/`} onClick={() => handleIconClick("home")}>
            <FontAwesomeIcon
              icon={faHome}
              style={iconStyle("home")}
              data-icon="home"
              onMouseEnter={(e) => iconHoverStyle(e, true)}
              onMouseLeave={(e) => iconHoverStyle(e, false)}
            />
          </Link>
          <Link
            to={`/friendRequest`}
            onClick={() => handleIconClick("friendRequest")}
          >
            <FontAwesomeIcon
              icon={faUserFriends}
              style={iconStyle("friendRequest")}
              data-icon="friendRequest"
              onMouseEnter={(e) => iconHoverStyle(e, true)}
              onMouseLeave={(e) => iconHoverStyle(e, false)}
            />
          </Link>
          <FontAwesomeIcon
            icon={faPlay}
            style={iconStyle("play")}
            data-icon="play"
            onMouseEnter={(e) => iconHoverStyle(e, true)}
            onMouseLeave={(e) => iconHoverStyle(e, false)}
            onClick={() => handleIconClick("play")}
          />
          <FontAwesomeIcon
            icon={faPlusSquare}
            style={iconStyle("plus")}
            data-icon="plus"
            onMouseEnter={(e) => iconHoverStyle(e, true)}
            onMouseLeave={(e) => iconHoverStyle(e, false)}
            onClick={() => handleIconClick("plus")}
          />
          <FontAwesomeIcon
            icon={faHeart}
            style={iconStyle("heart")}
            data-icon="heart"
            onMouseEnter={(e) => iconHoverStyle(e, true)}
            onMouseLeave={(e) => iconHoverStyle(e, false)}
            onClick={() => handleIconClick("heart")}
          />
        </Col>
        <Col className="col-3 d-flex justify-content-end">
          <FontAwesomeIcon
            icon={faEnvelope}
            style={iconStyle("envelope")}
            data-icon="envelope"
            onMouseEnter={(e) => iconHoverStyle(e, true)}
            onMouseLeave={(e) => iconHoverStyle(e, false)}
            onClick={() => {
              setDoseMessageListOpen(!doseMessageListOpen);
              setDoesNotificationContainerOpen(false);
              handleIconClick("envelope");
            }}
          />
          <FontAwesomeIcon
            icon={faBell}
            style={iconStyle("bell")}
            data-icon="bell"
            onMouseEnter={(e) => iconHoverStyle(e, true)}
            onMouseLeave={(e) => iconHoverStyle(e, false)}
            onClick={() => {
              setDoesNotificationContainerOpen(!doesNotificationContainerOpen);
              setDoseMessageListOpen(false);
              handleIconClick("bell");
            }}
          />
          <NavDropdown
            title={
              <FontAwesomeIcon
                icon={faUser}
                style={{
                  fontSize: "25px",
                  color: "black",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, background-color 0.3s ease",
                  padding: "10px",
                  borderRadius: "50%",
                  backgroundColor:
                    selectedIcon === "user" ? "#e6f7ff" : "transparent",
                }}
                data-icon="user"
                onMouseEnter={(e) => iconHoverStyle(e, true)}
                onMouseLeave={(e) => iconHoverStyle(e, false)}
              />
            }
            id="basic-nav-dropdown"
            align="end"
          >
            <NavDropdown.Item onClick={handleToProfile}>
              <div className="d-flex align-items-center">
                <Image
                  src={profile.avatar}
                  roundedCircle
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  {profile.firstName + " " + profile.lastName}
                </span>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Col>
      </Row>
    </Container>
  );
}
