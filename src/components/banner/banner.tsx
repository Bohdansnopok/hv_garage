import Image from "next/image";
import "./banner.css";
import car from "../../../public/electricaInCar.png"

export default function Banner() {
  return (
    <section className="banner">
      <div className="container">
        <div className="banner_right">
          <h1 className="banner__title">hv_Garage_26</h1>
          <div className="banner__buttons">
            <a href="" className="banner__buttons__button redBtn">
              Про нас
            </a>
            <a href="" className="banner__buttons__button darkBtn">
              Контакти
            </a>
          </div>
        </div>

        <div className="banner_left">
            <Image src={car}/>
        </div>
      </div>
    </section>
  );
}
