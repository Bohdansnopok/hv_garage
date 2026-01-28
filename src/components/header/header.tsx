import Image from "next/image";
import logo from "../../../public/logo.png";
import tiktok from "../../../public/tiktok.svg";
import instagram from "../../../public/instagram.svg";
import "./header.css";

export default function Header() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    {name: "Про нас", id: "aboutUs"},
    {name: "Послуги", id: "services"},
    {name: "Контакти", id: "contacts"},
  ]

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
          {navItems.map((navItems) => (
<a key={navItems.id} href={`#${navItems.id}`} className="header__nav">
            {navItems.name}
          </a>
          ))}
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
