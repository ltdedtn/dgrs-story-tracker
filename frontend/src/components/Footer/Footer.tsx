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

      <div className="flex space-x-4">
        <div className="flex-none ml-4">
          <a
            href="https://degenerousdao.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DGRS Website"
          >
            DGRS
          </a>
        </div>
        <a
          href="https://x.com/degenerousdao"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DGRS Twitter"
        >
          <span className="text-xl">
            <FaTwitter />
          </span>
        </a>
        <a
          href="https://discord.gg/wA5rP9VFNK"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DGRS Discord"
        >
          <span className="text-xl">
            <FaDiscord />
          </span>
        </a>
        <a
          href="https://www.tiktok.com/@degenerousdao"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DGRS TikTok"
        >
          <span className="text-xl">
            <FaTiktok />
          </span>
        </a>
        <a
          href="https://www.youtube.com/@degenerous"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DGRS YouTube"
        >
          <span className="text-xl">
            <FaYoutube />
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
