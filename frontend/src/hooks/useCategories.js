import { useEffect, useState } from "react";
import axios from "axios";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
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

  return categories;
};

export default useCategories;
