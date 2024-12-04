import React, { useState, useEffect } from "react";
import { Container, Row, Image, Button, Nav } from "react-bootstrap";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { getAllUser } from "./services/API";
import { findUser } from "./services/API";

export default function SearchResult() {
  const [searchParams] = useSearchParams();

  const [resultList, setResultList] = useState([]);

  const query = searchParams.get("q");

  useEffect(() => {
    findUser(query)
      .then((res) => {
        setResultList(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container className="position-relative">
      {resultList.map((user) => (
        <Container
          className="p-3 m-3 border rounded shadow-sm position-relative start-50 translate-middle-x d-flex"
          style={{ height: 100, width: 500 }}
        >
          <Link
            className="d-flex text-decoration-none text-dark"
            to={`/profile/${user.id}`}
          >
            <Image
              className="me-3 border border-white rounded-circle"
              src={user.avatar}
              style={{ width: 70, height: 70, objectFit: "cover" }}
            />
            <h4 className="m-1">{user.firstName + " " + user.lastName}</h4>
          </Link>
        </Container>
      ))}
    </Container>
  );
}
