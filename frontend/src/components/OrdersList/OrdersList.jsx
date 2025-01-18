import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import "./OrdersList.scss";
// --------------------------------
const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const statusOrder = ["pending", "shipped", "delivered"];
  useEffect(() => {
    // Запрос на сервер для получения списка заказов
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  // --------------------------------
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // --------------------------------
  const sortOrders = (field, direction) => {
    return [...orders].sort((a, b) => {
      let valA;
      let valB;

      if (field === "status") {
        valA = statusOrder.indexOf(a.status);
        valB = statusOrder.indexOf(b.status);
      } else if (field === "date") {
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
      }

      if (direction === "asc") {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
  };
  // Обработчик изменения поля сортировки
  const handleSortChange = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  if (loading) {
    return <CircularProgress />;
  }

  const sortedOrders = sortOrders(sortField, sortDirection);
  // ====================================
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options);
  };
  // ====================================
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow className="tableHead">
            <TableCell>Numer</TableCell>
            <TableCell>Customer Info</TableCell>
            <TableCell>
              <Button onClick={() => handleSortChange("date")}>
                Date sorting
              </Button>
            </TableCell>
            <TableCell>Total</TableCell>
            <TableCell>
              <Button onClick={() => handleSortChange("status")}>
                Status sorting
              </Button>
            </TableCell>
            <TableCell>Change Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="tableBody">
          {sortedOrders.map((order, index) => (
            <TableRow
              key={index}
              sx={{
                padding: 6,
                width: "100%",
              }}
              className="tableRow"
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Typography component="p">{order.user.name}</Typography>
                <Typography component="p">{order.user.email}</Typography>
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.totalAmount}$</TableCell>
              <TableCell>{order.status}</TableCell>
              <Box style={{ margin: "auto" }}>
                <Select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  sx={{ margin: 1 }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
              </Box>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersList;
