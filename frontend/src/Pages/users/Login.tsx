import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { useUserContext } from "./UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUsername, setRole } = useUserContext();
  const [error, setError] = useState<string | null>(null);

  // Function to check if the token is expired
  const isTokenExpired = (token: string) => {
    if (!token) return true;

    try {
      const { exp } = jwtDecode<{ exp: number }>(token); // Decode token
      if (!exp) return true;
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      return exp < currentTime; // Token is expired if exp is less than current time
    } catch (error) {
      return true; // If token is invalid or error occurs, treat it as expired
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const loginData = {
      Username: formData.get("username") as string,
      Password: formData.get("password") as string,
    };

    try {
      setError(null); // Clear previous error message
      const response = await fetch("https://localhost:7023/api/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Login failed");
      }

      const data = await response.json();
      const token = data.token;
      const username = data.username;
      const role = data.role;

      // Check if the token is expired before proceeding
      if (isTokenExpired(token)) {
        throw new Error("Session expired. Please log in again.");
      }

      // Store token, username, and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      // Set username and role in context
      setUsername(username);
      setRole(role);

      // Redirect to the stories page
      navigate("/stories");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="pt-8 relative flex flex-col justify-center">
      <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form">
            <h2>Login</h2>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Display error */}
          </div>
          <div>
            <label className="label" htmlFor="username">
              Username/Email:
            </label>
            <input
              className={`w-full input input-bordered`}
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              placeholder="Username or Email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password:
            </label>
            <input
              className={`w-full input input-bordered`}
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              placeholder="Password"
            />
          </div>
          <div>
            <button className="btn btn-block" type="submit">
              Login
            </button>
          </div>
          <div>
            <Link to="/signUp">
              <button className="btn btn-block" type="button">
                Sign Up
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
