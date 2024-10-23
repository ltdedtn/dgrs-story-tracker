import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string) => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    if (!exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    return true; // Treat token as expired if there's an error
  }
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  // If the token is expired or missing, redirect to login
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
