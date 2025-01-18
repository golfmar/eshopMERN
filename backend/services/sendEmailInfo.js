import nodemailer from "nodemailer";

export const sendEmailInfo = async (userEmail, products) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Используем Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const productsDetails = products
      .map((product) => `${product.productName}: ${product.quantity}`)
      .join(", ");
    let info = await transporter.sendMail({
      from: '"Shop Team" <no-reply@shop.com>',
      to: userEmail, // Получатель
      subject: `Your order `, // Тема письма
      text: `Dear customer, your order has been placed . Your order details: Products: ${productsDetails}. Thank you for shopping with us!`,
    });

    console.log("Email sent: ", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
