import logo from "../assets/logo.png";
import "./Header.css";

function Header() {
  return (
    <>
      <header>
        <a href="#">
          <img src={logo} alt="logo" />
        </a>
      </header>
    </>
  );
}

export default Header;
