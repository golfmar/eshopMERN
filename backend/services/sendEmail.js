import nodemailer from "nodemailer";

export const sendOrderStatusEmail = async (userEmail, status, products) => {
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
      subject: `Your order status has been updated to ${status}`, // Тема письма
      text: `Dear customer, your order status has been updated to "${status}". Yout order details: Products: ${productsDetails}. Thank you for shopping with us!`,
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
