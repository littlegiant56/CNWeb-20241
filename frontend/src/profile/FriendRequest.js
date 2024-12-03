import React, { useState, useEffect } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriendRequest,
  getProfileByUserId,
} from "../services/API";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";

function FriendTile({ friendId, friendRequests, setFriendRequests }) {
  const [friendProfile, setFriendProfile] = useState();

  const handleAcceptFriendRequest = (friendId) => {
    acceptFriendRequest({
      userId: localStorage.getItem("userId"),
      friendId: friendId,
    })
      .then(() => {
        toast.success("Add new friend successfully");
        setFriendRequests(friendRequests.filter((id) => id !== friendId));
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      });
  };

  const handleDeclineFriendRequest = (friendId) => {
    declineFriendRequest({
      userId: localStorage.getItem("userId"),
      friendId: friendId,
    })
      .then(() => {
        toast.success("Delete friend request successfully");
        setFriendRequests(friendRequests.filter((id) => id !== friendId));
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      });
  };

  useEffect(() => {
    getProfileByUserId(friendId)
      .then((res) => {
        setFriendProfile(res.data.user);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [friendId]);

  return (
    friendProfile && (
      <Card
        className="shadow-sm me-3"
        style={{
          width: "200px",
          borderRadius: "10px",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Card.Img
          variant="top"
          src={friendProfile.avatar}
          style={{ height: "150px", objectFit: "cover" }}
        />
        <Card.Body>
          <Link
            to={`/profile/${friendId}`}
            style={{ textDecoration: "none", color: "#333" }}
          >
            <Card.Title className="text-truncate">
              {friendProfile.firstName + " " + friendProfile.lastName}
            </Card.Title>
          </Link>
          <div className="d-flex justify-content-between mt-3">
            <Button
              variant="success"
              className="d-flex align-items-center btn-sm"
              onClick={() => handleAcceptFriendRequest(friendId)}
            >
              <FaCheck />
            </Button>
            <Button
              variant="danger"
              className="d-flex align-items-center btn-sm"
              onClick={() => handleDeclineFriendRequest(friendId)}
            >
              <FaTimes />
            </Button>
          </div>
        </Card.Body>
      </Card>
    )
  );
}

export default function FriendRequest() {
  const userId = localStorage.getItem("userId");
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getAllFriendRequest(userId)
      .then((res) => {
        setFriendRequests(res.data.id);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);

  return (
    <div className="mt-4">
      <h1 className="text-center mb-4">Friend Request</h1>
      <div
        className="d-flex overflow-auto"
        style={{
          whiteSpace: "nowrap",
          paddingBottom: "10px",
        }}
      >
        {friendRequests.length > 0 ? (
          friendRequests.map((friendId, index) => (
            <FriendTile
              key={index}
              friendId={friendId}
              friendRequests={friendRequests}
              setFriendRequests={setFriendRequests}
            />
          ))
        ) : (
          <p className="text-center w-100">No friend requests yet.</p>
        )}
      </div>
    </div>
  );
}
