import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Пожалуйста, заполните все поля." });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // или любой другой почтовый сервис
      auth: {
        user: process.env.EMAIL_USER, // Убедитесь, что переменные окружения настроены
        pass: process.env.GMAIL_APP_PASSWORD, // Для Gmail используйте App Password, если двухфакторка включена
      },
    });

    // Формируем тело письма
    let mailOptions = {
      from: '"Contact Form" <no-reply@shop.com>', // От кого
      to: process.env.EMAIL_USER, // Адрес, куда отправляется письмо (например, ваш email)
      subject: `Сообщение от ${name} - ${subject}`, // Тема письма
      text: `Сообщение от ${name} (email: ${email})\n\nТема: ${subject}\n\nСообщение: ${message}`,
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    // Отправляем успешный ответ
    res.status(200).json({ message: "Сообщение успешно отправлено." });
  } catch (error) {
    console.error("Ошибка при отправке email:", error);
    res
      .status(500)
      .json({ error: "Не удалось отправить сообщение. Попробуйте позже." });
  }
};
