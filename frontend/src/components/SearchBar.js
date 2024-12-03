import React, { useState, useEffect, useRef } from "react";
import { Container, Form, ListGroup, Image } from "react-bootstrap";
import { findUser } from "../services/API";
import { Link } from "react-router-dom";
import userIcon from "../assets/icons/user.png";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceSearch = useRef();

  useEffect(() => {
    debounceSearch.current = debounce((searchQuery) => {
      if (searchQuery) {
        setLoading(true);
        findUser(searchQuery)
          .then((res) => {
            setSuggestions(res.data.users || []);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setSuggestions([]);
      }
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debounceSearch.current(value);
  };

  return (
    <Container className="search-container position-relative">
      <Form id="Search" className="justify-content-center">
        <Form.Control
          className="rounded-pill"
          type="text"
          placeholder="Search"
          style={{ height: "50px" }}
          value={query}
          onChange={handleInputChange}
        />
      </Form>

      {query && (
        <ListGroup
          className="position-absolute mt-2 shadow-sm"
          style={{
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1050,
          }}
        >
          {loading ? (
            <ListGroup.Item>Searching...</ListGroup.Item>
          ) : suggestions.length > 0 ? (
            suggestions.map((user) => (
              <ListGroup.Item
                key={user.id}
                className="d-flex align-items-center"
              >
                <Image
                  src={user.avatar || userIcon}
                  roundedCircle
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  alt={user.name}
                  className="me-3"
                />
                <Link
                  to={`/profile/${user.id}`}
                  className="text-decoration-none text-dark"
                >
                  {user.firstName} {user.lastName}
                </Link>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No results found.</ListGroup.Item>
          )}
        </ListGroup>
      )}
    </Container>
  );
}
