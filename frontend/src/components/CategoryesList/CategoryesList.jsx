import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { setCategories } from "../../redux/actions/categoriesActions";
const CategoryesList = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // --------------------------------
  // Обработчик для редактирования категории
  const handleEditCategory = (category) => {
    setCategoryToEdit(category); // Устанавливаем редактируемую категорию
    setCategoryName(category.name); // Устанавливаем имя категории в инпут
  };
  // --------------------------------
  // Обработчик для изменения названия категории в форме
  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };
  // --------------------------------
  // Обработчик удаления категории
  const handleDeleteCategory = (categoryId) => {
    setLoading(true); // Начинаем загрузку
    axios
      .delete(`${process.env.REACT_APP_API_URL}/categories/${categoryId}`)
      .then(() => {
        // Убираем удаленную категорию из списка
        setCategories(
          categories.filter((category) => category._id !== categoryId)
        );
        setLoading(false); // Завершаем загрузку
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        setLoading(false); // Завершаем загрузку при ошибке
      });
  };
  // --------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = categoryToEdit
      ? `${process.env.REACT_APP_API_URL}/categories/${categoryToEdit._id}`
      : `${process.env.REACT_APP_API_URL}/categories`;
    const method = categoryToEdit ? "put" : "post";

    axios[method](url, { name: categoryName })
      .then((response) => {
        if (categoryToEdit) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category._id === categoryToEdit._id ? response.data : category
            )
          );
        } else {
          setCategories((prevCategories) => [...prevCategories, response.data]);
        }

        setSuccessMessage(
          categoryToEdit
            ? "Category updated successfully"
            : "Category added successfully"
        );
        setTimeout(() => {
          setSuccessMessage("");
          setCategoryName("");
          setCategoryToEdit(null); // Сбрасываем редактируемую категорию
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error saving category:", error);
        setLoading(false);
      });
  };
  return (
    <div className="categoryeslist">
      <List>
        {categories.map((category) => (
          <ListItem key={category._id} button>
            <ListItemText primary={category.name} />
            <IconButton onClick={() => handleEditCategory(category)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteCategory(category._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">
          {categoryToEdit ? "Edit the category name" : "Add new category"}
        </Typography>
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={categoryName}
          onChange={handleChange}
          style={{ marginBottom: "20px" }}
        />
        {successMessage && (
          <Typography color="success">{successMessage}</Typography>
        )}
        {loading && (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
        <Button variant="contained" color="primary" type="submit">
          {categoryToEdit ? "Update Category" : "Add Category"}
        </Button>
      </form>
    </div>
  );
};

export default CategoryesList;
