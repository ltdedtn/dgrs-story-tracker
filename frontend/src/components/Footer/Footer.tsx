import React, { useEffect } from "react";

const Footer = () => {
  const theme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    document
      .querySelector("footer")
      ?.setAttribute("data-theme", localTheme || "light");
  }, [theme]);

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
      <div className="flex-none">Ltdedtn</div>
    </div>
  );
};

export default Footer;
