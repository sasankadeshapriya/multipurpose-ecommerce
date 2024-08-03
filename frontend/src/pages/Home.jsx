import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Send the data to the server
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message || "An error occurred. Please try again.");
      } else {
        console.log("Signed out successfully");
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div>
        <h1>Home Page - Ecomy</h1>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        style={{
          padding: "10px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
