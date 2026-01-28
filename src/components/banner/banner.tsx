import Image from "next/image";
import "./banner.css";
import car from "../../../public/electricaInCar.png";

export default function Banner() {
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

  const redBtn = [{ name: "Про нас", id: "aboutUs" }];
  const darkBtn = [{ name: "Контакти", id: "contacts" }];
  return (
    <section className="banner">
      <div className="container">
        <div className="banner_right">
          <h1 className="banner__title">hv_Garage_26</h1>
          <div className="banner__buttons">
            {redBtn.map((redBtn) => (
              <a
                key={redBtn.id}
                href={`#${redBtn.id}`}
                className="banner__buttons__button redBtn"
              >
                {redBtn.name}
              </a>
            ))}
            {darkBtn.map((darkBtn) => (
              <a
                key={redBtn.id}
                href={`#${darkBtn.id}`}
                className="banner__buttons__button darkBtn"
              >
                {darkBtn.name}
              </a>
            ))}
          </div>
        </div>

        <div className="banner_left">
          <Image src={car} alt="" />
        </div>
      </div>
    </section>
  );
}
