import React, { useState } from "react";
import { Container, Row, Col, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

/**
 * Represents the navigation bar component.
 * @returns {JSX.Element} The JSX element representing the navigation bar.
 */
export default function NavBar({
  doesNotificationContainerOpen,
  setDoesNotificationContainerOpen,
  doseMessageListOpen,
  setDoseMessageListOpen,
}) {
  const navigate = useNavigate();
  // Các state để theo dõi icon nào được chọn
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    // Disconnect socket.io connection
    socket.disconnect();
    navigate("/login");
  };

  // Hàm để thay đổi màu sắc của icon khi nhấn
  const handleIconClick = (icon) => {
    setSelectedIcon(icon === selectedIcon ? null : icon); // Toggle the selected icon
  };

  const handleToProfile = () => {
    navigate(`/profile/${localStorage.getItem("userId")}`);
  };

  return (
    <Container
      className="p-2 border-bottom sticky-top"
      fluid
      style={{ backgroundColor: "#fff" }}
    >
      <Row className="align-items-center">
        <Col className="col-3 d-flex align-items-center">
          <Link className="me-0" to={"/"}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "50px", height: "50px" }}
            />
          </Link>
          <SearchBar />
        </Col>
        <Col className="col-6">
          <Link to={`/`} onClick={() => handleIconClick("home")}>
            <FontAwesomeIcon
              icon={faHome}
              style={{
                fontSize: "25px",
                marginLeft: "102px",
                cursor: "pointer",
                color: selectedIcon === "home" ? "blue" : "black", // Màu xanh khi chọn
              }}
            />
          </Link>
          <Link
            to={`/friendRequest`}
            onClick={() => handleIconClick("friendRequest")}
          >
            <FontAwesomeIcon
              icon={faUserFriends}
              style={{
                fontSize: "25px",
                marginLeft: "85px",
                color: selectedIcon === "friendRequest" ? "blue" : "black",
                cursor: "pointer",
              }}
            />
          </Link>
          <FontAwesomeIcon
            icon={faPlay}
            style={{
              fontSize: "25px",
              marginLeft: "85px",
              color: selectedIcon === "play" ? "blue" : "black",
              cursor: "pointer",
            }}
            onClick={() => handleIconClick("play")}
          />
          <FontAwesomeIcon
            icon={faPlusSquare}
            style={{
              fontSize: "25px",
              marginLeft: "85px",
              color: selectedIcon === "plus" ? "blue" : "black",
              cursor: "pointer",
            }}
            onClick={() => handleIconClick("plus")}
          />
          <FontAwesomeIcon
            icon={faHeart}
            style={{
              fontSize: "25px",
              marginLeft: "85px",
              color: selectedIcon === "heart" ? "blue" : "black",
              cursor: "pointer",
            }}
            onClick={() => handleIconClick("heart")}
          />
        </Col>
        <Col className="col-3 d-flex justify-content-end">
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{
              fontSize: "25px",
              cursor: "pointer",
              color: selectedIcon === "envelope" ? "blue" : "black",
            }}
            onClick={() => {
              setDoseMessageListOpen(!doseMessageListOpen);
              setDoesNotificationContainerOpen(false);
              handleIconClick("envelope");
            }}
          />
          <FontAwesomeIcon
            icon={faBell}
            style={{
              fontSize: "25px",
              cursor: "pointer",
              marginLeft: "25px",
              color: selectedIcon === "bell" ? "blue" : "black",
            }}
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
                style={{ fontSize: "25px", margin: "0 25px" }}
              />
            }
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item onClick={handleToProfile}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>
              Đăng xuất
            </NavDropdown.Item>
          </NavDropdown>
        </Col>
      </Row>
    </Container>
  );
}
