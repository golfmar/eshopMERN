// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // ------------------------------------------------------

  // ------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrorMessage("");
    setSuccessMessage("");
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/register`,
          formData
        );
        setSuccessMessage("Registration successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        console.error(error.response.data);
      }
    }
  };

  return (
    <Container maxWidth="xs" className="pageContent">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          mb: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Registration
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              variant="outlined"
            />
          </div>
          <div>
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              variant="outlined"
            />
          </div>
          {errors && <Typography color="error">{errorMessage}</Typography>}
          {successMessage && (
            <Typography color="success">{successMessage}</Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 1 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
