
import "./offerForm.css";
import emailjs from "@emailjs/browser";

export default function OfferForm() {
  const sendEmail = (finalAnswers: string[]) => {
    // Формируем объект для шаблона EmailJS
    const templateParams = {
      size: finalAnswers[0],
      email: finalAnswers[1],
      first_name: finalAnswers[2],
      last_name: finalAnswers[3],
      phone: finalAnswers[4],
    };

    emailjs
      .send(
        "service_pc2xw5l", // ID сервиса
        "template_b0r5qrm", // ID шаблона
        templateParams,
        "8NZp45tv9FVj115mP", // Твой Public Key
      )
      .then(
        () => {
          console.log("SUCCESS!");
          // router.push("/emailsend");
        },
        (error) => {
          console.log("FAILED...", error);
          alert("Ошибка при отправке, попробуйте позже.");
        },
      );
  };

  return (
    <section id="contacts" className="offerForm">
      <div className="container">
        <form className="offerForm__form">
          <h1>Зробити замовлення</h1>
          <input type="text" />
          <input type="text" />
          <input type="text" />
          <input type="text" />
          <input type="text" />
          <button type="submit" className="redBtn">
            ЗАМОВИТИ
          </button>
        </form>

        <div className="offerForm__contacts">
          <h1>Контакти</h1>
          <div className="offerForm__contacts__contact">Снопок Іван</div>
          <a className="offerForm__contacts__contact" href="tel:+380965821735">
            +380965821735
          </a>
          <a
            className="offerForm__contacts__contact"
            href="mailto:snopokbogdan3@gmail.com"
          >
            snopokbogdan3@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
