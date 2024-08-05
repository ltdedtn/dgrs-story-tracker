import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const EditUserForm = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7023/api/User/${userId}`
        );
        const user = response.data;
        setUsername(user.username);
        setEmail(user.email);
      } catch (error) {
        console.error("Error fetching user", error);
        alert("Failed to fetch user. Please try again later.");
      }
    };

    fetchUser();
  }, [userId]);

  const handlePasswordChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setValidPassword(PASSWORD_REGEX.test(newPassword));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validPassword && password) {
      alert("Please fill out the form correctly.");
      return;
    }

    try {
      const updatedUserData: any = {
        userId: parseInt(userId || "0"),
        username: username,
        email: email,
        passwordHash: password,
      };

      if (password) {
        updatedUserData.password = password;
      }

      const response = await axios.put(
        `https://localhost:7023/api/User/${userId}`,
        updatedUserData
      );

      if (response.status !== 204) {
        throw new Error("Update failed");
      }

      alert("User updated successfully");
      navigate("/dash"); // Navigate to the users dashboard or any other route
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed. Please try again.");
    }
  };

  return (
    <>
      <div className="pt-8 relative flex flex-col justify-center">
        <div className="p-6 m-auto bg-grey rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form">
              <div>
                <label className="label" htmlFor="email">
                  Email:
                </label>
                <input
                  className={`w-full input input-bordered`}
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  autoComplete="off"
                  placeholder="Email"
                  disabled // Disable the email input field
                />
              </div>
              <div>
                <label className="label" htmlFor="username">
                  Username:
                </label>
                <input
                  className={`w-full input input-bordered`}
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  autoComplete="off"
                  placeholder="Username"
                  disabled // Disable the username input field
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
                  value={password}
                  autoComplete="off"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
                {!validPassword && password && (
                  <span className="text-red-500">
                    Password must be at least 8 characters long and include at
                    least one letter, one number, and one special character.
                  </span>
                )}
              </div>
              <div>
                <button className="btn btn-block" type="submit">
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserForm;
