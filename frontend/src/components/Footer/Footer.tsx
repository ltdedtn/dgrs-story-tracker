import {
  FaTwitter,
  FaDiscord,
  FaTiktok,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="navbar bg-base-100 shadow-lg px-4 sm:px-8 flex justify-between items-center">
      <div className="flex space-x-4">
        <div className="flex-none">ltdedtn</div>
        <a
          href="https://github.com/ltdedtn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-xl">
            <FaGithub />
          </span>
        </a>
        <a
          href="https://www.youtube.com/@ltdedtn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <span className="text-xl">
            <FaYoutube />
          </span>
        </a>
        <a
          href="https://x.com/Itdedtn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <span className="text-xl">
            <FaTwitter />
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
