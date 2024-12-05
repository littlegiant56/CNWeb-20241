import React, { useEffect, useState } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import userIcon from "../assets/icons/user.png";
import { Link } from "react-router-dom";
import { getProfileByUserId, getFriendList } from "../services/API";

function ProfileSideBar({ userId }) {
  const [profile, setProfile] = useState();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getProfileByUserId(userId)
      .then((res) => {
        setProfile(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
    getFriendList(userId)
      .then((res) => {
        setFriends(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  return (
    <Container
      className="p-3 m-0 border rounded shadow-sm"
      style={{ width: "100%" }}
    >
      {profile && (
        <>
          <h4>Mô tả bản thân bạn đi banj oi asdsad dddd</h4>
          {profile.description && (
            <p>
              <span className="fw-semibold">Introduce: </span>
              {profile.description}
            </p>
          )}
          {profile.address && (
            <p>
              <span className="fw-semibold">Lives in: </span>
              {profile.address}
            </p>
          )}
          {profile.DOB && (
            <p>
              <span className="fw-semibold">Date of birth: </span>
              {profile.DOB}
            </p>
          )}
          {profile.school && (
            <p>
              <span className="fw-semibold">Study/Work at: </span>
              {profile.school}
            </p>
          )}
          {profile.work && (
            <p>
              <span className="fw-semibold">Work: </span>
              {profile.work}
            </p>
          )}
        </>
      )}
      {/* <Container className="mt-4">
        <h4>Danh sách bạn bè</h4>
        {friends?.length > 0 ? (
          <Row className="g-3">
            {friends.map((friend) => (
              <Col key={friend.id} xs={4} md={3} lg={2} className="text-center">
                <Link
                  to={`/profile/${friend.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Image
                    src={friend.avatar || userIcon}
                    roundedCircle
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    alt={`${friend.firstName} ${friend.lastName}`}
                  />
                  <p
                    className="mt-2 mb-0 text-truncate"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {friend.firstName} {friend.lastName}
                  </p>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p>Chưa có bạn bè nào.</p>
        )}
      </Container> */}
    </Container>
  );
}

export default ProfileSideBar;
