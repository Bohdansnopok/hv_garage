import "./services.css";

export default function Services() {
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

  const redBtn = [{ name: "Замовити", id: "contacts" }];

  return (
    <section id="services" className="services">
      <div className="container">
        <h1>Наші послуги</h1>
        <div className="services__cards">
          <div className="services__cards__grid">
            <div className="services__cards__grid__card">
              <h2>Запчастини</h2>
              {redBtn.map((redBtn) => (
                <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                  {redBtn.name}
                </a>
              ))}
            </div>
            <div className="services__cards__grid__card">
              <h2>РЕМОНТ ЕЛЕКТРОПРОВОДКИ</h2>
              {redBtn.map((redBtn) => (
                <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                  {redBtn.name}
                </a>
              ))}
            </div>
            <div className="services__cards__grid__card">
              <h2>ЧІП ТЮНІНГ</h2>
              {redBtn.map((redBtn) => (
                <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                  {redBtn.name}
                </a>
              ))}
            </div>
            <div className="services__cards__grid__card">
              <h2>ПРОГРАМУВАННЯ</h2>
              {redBtn.map((redBtn) => (
                <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                  {redBtn.name}
                </a>
              ))}
            </div>
            <div className="services__cards__grid__card">
              <h2>ДІАГНОСТИКА</h2>
              {redBtn.map((redBtn) => (
                <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                  {redBtn.name}
                </a>
              ))}
            </div>
            <div className="services__cards__grid__card">
              <h2>РЕМОНТ АВТОМОБІЛЬНОЇ ЕЛЕКТРОНІКИ</h2>
              {redBtn.map((redBtn) => (
                <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                  {redBtn.name}
                </a>
              ))}
            </div>
          </div>
          <div className="services__cards__card">
            <h2>ІНШІ ПОСЛУГИ</h2>
            {redBtn.map((redBtn) => (
              <a key={redBtn.id} href={`#${redBtn.id}`} className="redBtn">
                {redBtn.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
