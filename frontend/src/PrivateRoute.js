import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";
import { socket } from "./socket";

/**
 * Renders a private route component based on the presence of a user ID in the local storage.
 * If the user ID exists, it renders the `Layout` component.
 * If the user ID does not exist, it navigates to the login page using the `Navigate` component.
 * @returns {JSX.Element} The rendered private route component.
 */
export default function PrivateRoute() {
  useEffect(() => {
    console.log("name " + localStorage.getItem("userId"));
  });
  return localStorage.getItem("userId") ? (
    <Layout />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}
