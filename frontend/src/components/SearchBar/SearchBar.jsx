import React, { useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// ==================================
const SearchBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (query) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/products`,
          {
            params: {
              name: query,
            },
          },
        );

        if (response.data.length > 0) {
          setTimeout(() => {
            navigate(`/product/${response.data[0]._id}`);
            setIsLoading(false);
            setQuery("");
            setError("");
            onSearch(response.data);
          }, 1000);
        } else {
          setIsLoading(false);
          setError("Product not found.");
          setTimeout(() => {
            setError("");
            setQuery("");
          }, 1000);
        }
      } else {
        setQuery("");
        setIsLoading(false);
        setError("Enter the product name.");
        setTimeout(() => {
          setError("");
        }, 1000);
      }
    } catch (err) {
      setQuery("");
      setIsLoading(false);
      setError(
        "An error occurred while searching for the product. Check the product name.",
        err,
      );
      setTimeout(() => {
        setError("");
      }, 1000);
    } finally {
      setTimeout(() => {
        setQuery("");
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Box className="search-bar">
        <TextField
          label="Product name"
          variant="outlined"
          value={query.trim()}
          onChange={handleInputChange}
          sx={{ height: "40px" }}
          sx={{
            width: "100%",
            "& input": {
              height: "40px",
              padding: "0",
            },
            "& .MuiInputLabel-root": {
              transform:
                isLoading || query
                  ? "translate(12px, -8px) scale(.8)"
                  : "translate(12px, 10px) scale(1)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              transform: "translate(12px, -8px) scale(.8)",
            },
          }}
        />
        <SearchIcon
          onClick={handleSearch}
          className="search-bar-button"
          style={{ color: "#BAB9BA" }}
        />
      </Box>
      {isLoading && (
        <CircularProgress
          style={{ width: "20px", height: "20px", marginTop: "10px" }}
        />
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
};

export default SearchBar;
