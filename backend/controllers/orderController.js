import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { sendOrderStatusEmail } from "../services/sendEmail.js";
import { sendEmailInfo } from "../services/sendEmailInfo.js";

export const createOrder = async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;
    const newOrder = new Order({
      user,
      products,
      totalAmount,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};
// ------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
// ------------------
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const products = order.products.map((product) => {
      const productName = product.productId.name;
      const quantity = product.quantity;
      return { productName, quantity };
    });
    const userEmail = order.user.email;
    console.log("userEmail", userEmail, products);
    await sendEmailInfo(userEmail, products);
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};
// ------------------
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params; // Получаем ID заказа из параметров
  const { status } = req.body; // Получаем новый статус из тела запроса
  // Проверяем, что статус является одним из допустимых значений
  const validStatuses = ["pending", "shipped", "delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user = await User.findById(order.user.toString());

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderDetales = await Order.findById(order._id)
      .populate("user")
      .populate("products.productId");
    const products = orderDetales.products.map((product) => {
      const productName = product.productId.name;
      const quantity = product.quantity;
      return { productName, quantity };
    });
    console.log(products);
    const userEmail = user.email;
    await sendOrderStatusEmail(userEmail, status, products);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};
