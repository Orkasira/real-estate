import logo from "../assets/logo.png";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <header>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </header>
    </>
  );
}

export default Header;
