import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../Pages/users/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { username, setUsername } = useUserContext();

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    document
      .querySelector("html")
      ?.setAttribute("data-theme", localTheme || "light");
  }, [theme]);

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 w-52 p-2 shadow bg-base-100 rounded-box"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/stories">Stories</Link>
            </li>
            <li>
              <Link to="/characters">Characters</Link>
            </li>
            <li>
              <Link to="/dash">Users</Link>
            </li>
            {username ? (
              <li>
                <button onClick={handleLogout}>Sign Out</button>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            <li>
              <label className="swap swap-rotate w-12 h-12">
                <input
                  type="checkbox"
                  onChange={handleToggle}
                  checked={theme === "dark"}
                />
                <div className="swap-off">🌙</div>
                <div className="swap-on">☀️</div>
              </label>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          ltdedtn
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/stories">Stories</Link>
          </li>
          <li>
            <Link to="/characters">Characters</Link>
          </li>
          <li>
            <Link to="/dash">Users</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end hidden lg:flex items-center">
        {username ? (
          <>
            <span>Welcome, {username}!</span>
            <button className="btn btn-ghost ml-4" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
        )}
        <label className="swap swap-rotate w-12 h-12 ml-4">
          <input
            type="checkbox"
            onChange={handleToggle}
            checked={theme === "dark"}
          />
          <div className="swap-off">🌙</div>
          <div className="swap-on">☀️</div>
        </label>
      </div>
    </div>
  );
};

export default Header;
