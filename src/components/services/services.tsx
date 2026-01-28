import './services.css'

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <h1>Наші послуги</h1>
        <div className="services__cards">
          <div className="services__cards__grid">
            <div className="services__cards__grid__card">
              <h2>Запчастини</h2>
              <a href="" className="redBtn">
                Замовити
              </a>
            </div>
            <div className="services__cards__grid__card">
              <h2>РЕМОНТ ЕЛЕКТРОПРОВОДКИ</h2>
              <a href="" className="redBtn">
                Замовити
              </a>
            </div>
            <div className="services__cards__grid__card">
              <h2>ЧІП ТЮНІНГ</h2>
              <a href="" className="redBtn">
                Замовити
              </a>
            </div>
            <div className="services__cards__grid__card">
              <h2>ПРОГРАМУВАННЯ</h2>
              <a href="" className="redBtn">
                Замовити
              </a>
            </div>
            <div className="services__cards__grid__card">
              <h2>ДІАГНОСТИКА</h2>
              <a href="" className="redBtn">
                Замовити
              </a>
            </div>
            <div className="services__cards__grid__card">
              <h2>РЕМОНТ АВТОМОБІЛЬНОЇ ЕЛЕКТРОНІКИ</h2>
              <a href="" className="redBtn">
                Замовити
              </a>
            </div>
          </div>
          <div className="services__cards__card">
            <h2>ІНШІ ПОСЛУГИ</h2>
            <a href="" className="redBtn">
              Замовити
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
