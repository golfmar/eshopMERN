import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Input,
  Typography,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/actions/productsActions";
import axios from "axios";
import useProducts from "../hooks/useProducts";
import { updateCartItem } from "../redux/actions/cartActions";
// ===============================================
const AddProductForm = ({ productToEdit, setProductToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useProducts();
  const products = useSelector((state) => state.products);

  useEffect(() => {
    if (isSubmitting) {
      setLoading(false);
      setTimeout(() => {
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        setSuccessMessage("");
      }, 1000);
    }
  }, [isSubmitting]);

  // --------------------------

  // --------------------------
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setPrice(productToEdit.price || 0);
      setDescription(productToEdit.description || "");
      setImage(productToEdit.image || null);
      setImagePreview(productToEdit.image || null);
    }
  }, [productToEdit]);
  useEffect(() => {
    if (isSubmitting) {
      setLoading(false);
      setTimeout(() => {
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        setSuccessMessage("");
      }, 1000);
    }
  }, [isSubmitting]);
  // --------------------------

  // --------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  // ----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "name:" + name,
      "price" + price,
      "description" + description,
      "image:" + image
    );
    // ------------
    if (productToEdit && (!name.trim() || !price || !image || !description)) {
      setErrorMessage("All fields are required.");
      return;
    } else if (!name.trim() || !price || !image || !description) {
      setErrorMessage("All fields are required.");
      return;
    }
    // ------------
    try {
      setLoading(true);
      setErrorMessage("");
      setIsSubmitting(false);
      // -----------------

      // ----------------------
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      // --------------------
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);
        imageFormData.append("upload_preset", "blogblog");
        imageFormData.append("cloud_name", "dke0nudcz");

        const imageResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload",
          imageFormData
        );
        const imageUrl = imageResponse.data.secure_url;
        formData.append("image", imageUrl);
      }
      // --------------------
      let response;
      if (productToEdit) {
        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/products/${productToEdit._id}`,
          formData
        );
        dispatch(
          setProducts(
            products.map((prod) =>
              prod._id === productToEdit._id ? response.data : prod
            )
          )
        );
        dispatch(
          updateCartItem({ ...response.data, category: productToEdit.category })
        );
        const updatedProducts = products.map((prod) =>
          prod._id === productToEdit._id ? response.data : prod
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        setSuccessMessage("The product has been updated successfully.");
        setProductToEdit(null);
      } else {
        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/products/add`,
          formData
        );
        dispatch(setProducts([...products, response.data]));
        const newProducts = [...products, response.data];
        localStorage.setItem("products", JSON.stringify(newProducts));
        setSuccessMessage("The product has been added successfully.");
      }
      setIsSubmitting(true);
    } catch (error) {
      console.error("Ошибка при добавлении продукта:", error);
      setErrorMessage(
        "Не удалось добавить продукт. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Product name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Product price"
        type="number"
        fullWidth
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Product description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />

      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          sx={{ width: "100%", marginBottom: 2 }}
        >
          {image ? "Image Selected" : "Choose Image"}
        </Button>
      </label>
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        sx={{ visibility: "hidden", position: "absolute" }}
      />
      {imagePreview && (
        <Box sx={{ marginBottom: 2, textAlign: "center" }}>
          <CardMedia
            component="img"
            image={imagePreview}
            alt={name}
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
              margin: "auto",
            }}
          />
        </Box>
      )}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      {successMessage && (
        <Typography color="success">{successMessage}</Typography>
      )}
      {loading && (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        style={{
          margin: "0 auto",
        }}
      >
        {productToEdit ? "Update Product" : "Add Product"}
      </Button>
    </Box>
  );
};

export default AddProductForm;
