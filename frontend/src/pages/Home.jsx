import React from "react";

export default function Home() {
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
        type="submit"
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
