import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import ModalMessage from "../../components/Modal/ModalMessage";
const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Начинаем загрузку, когда форма отправляется
    setError(""); // Сбрасываем предыдущее сообщение об ошибке
    setSuccessMessage(""); // Сбрасываем предыдущее сообщение об успехе

    const formData = { name, email, subject, message };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/contact`,
        formData
      );
      setOpenModal(true);
      setSuccessMessage("Your message has been sent successfully!");
      setTimeout(() => {
        setOpenModal(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 1500);
    } catch (error) {
      setSuccessMessage(
        "An error occurred while sending the message. Please try again later."
      );
      setOpenModal(true);
      setTimeout(() => {
        setOpenModal(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 1500);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }} className="pageContent">
      <Typography variant="h3" gutterBottom>
        Contact Form.
      </Typography>
      <Typography variant="p">
        You can write me your opinion or place an order to create a order here.
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <Grid container spacing={2}>
          {/* Имя */}
          <Grid item xs={12}>
            <TextField
              label="Ваше имя"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>

          {/* Тема */}
          <Grid item xs={12}>
            <TextField
              label="Тема сообщения"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Grid>

          {/* Сообщение */}
          <Grid item xs={12}>
            <TextField
              label="Ваше сообщение"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Grid>

          {/* Ошибка */}
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}

          {/* Сообщение об успехе */}
          {successMessage && (
            <ModalMessage
              open={openModal}
              message={successMessage}
            ></ModalMessage>
          )}

          {/* Кнопка отправки */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Отправить"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ContactForm;
