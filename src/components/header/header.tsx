import Image from "next/image";
import logo from "../../../public/logo.png";
import tiktok from "../../../public/tiktok.svg";
import instagram from "../../../public/instagram.svg";
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Image
          src={logo}
          width={118}
          height={118}
          alt=""
          className="header__logo"
        />
        <div className="header__navs">
          <a href="" className="header__nav">
            Про нас
          </a>
          <a href="" className="header__nav">
            Послуги
          </a>
          <a href="" className="header__nav">
            Контакти
          </a>
        </div>

        <div className="header__socials">
          <a href="" className="header__social">
            <Image src={tiktok} width={60} height={60} alt="" />
          </a>
          <a href="" className="header__social">
            <Image src={instagram} width={60} height={60} alt="" />
          </a>
        </div>
      </div>
    </header>
  );
}
