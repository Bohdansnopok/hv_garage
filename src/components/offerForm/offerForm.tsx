import './offerForm.css'

export default function OfferForm() {
  return (
    <section className="offerForm">
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
            <div className='offerForm__contacts__contact'>Снопок Іван</div>
            <a className='offerForm__contacts__contact' href="tel:+380965821735">+380965821735</a>
            <a className='offerForm__contacts__contact' href="mailto:snopokbogdan3@gmail.com">snopokbogdan3@gmail.com</a>
        </div>
      </div>
    </section>
  );
}
