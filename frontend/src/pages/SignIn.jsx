import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);

    // Send the data to the server
    try {
      const res = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // This is crucial for cookies to be sent
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An error occurred. Please try again.");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("An error occurred", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    window.open(`/api/user/auth/google`, "_self");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <h2>Sign In</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>
            Email:
            <input
              type="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              style={{ padding: "8px", fontSize: "16px", width: "100%" }}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              style={{ padding: "8px", fontSize: "16px", width: "100%" }}
            />
          </label>
        </div>
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <br />

        <button
          type="submit"
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Sign In
        </button>

        <br />

        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#db4437",
            color: "white",
          }}
        >
          Google Sign In
        </button>

        <br />

        <button
          type="submit"
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#3b5998",
            color: "white",
          }}
        >
          Facebook Sign In
        </button>
      </form>
    </div>
  );
}
