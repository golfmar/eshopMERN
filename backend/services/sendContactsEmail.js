import nodemailer from "nodemailer";

export const sendContactEmail = async (name, email, subject, message) => {
  try {
    // Настройка почтового транспорта
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Отправка письма
    let info = await transporter.sendMail({
      from: '"Contact Form" <no-reply@shop.com>',
      to: process.env.ADMIN_EMAIL, // Адрес получателя
      subject: `Сообщение от ${name} - ${subject}`, // Тема письма
      text: `Сообщение от ${name} (email: ${email})\n\nТема: ${subject}\n\nСообщение: ${message}`,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Ошибка при отправке email:", error);
    throw error;
  }
};
