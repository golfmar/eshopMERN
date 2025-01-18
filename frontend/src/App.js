import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import { useDispatch } from "react-redux";
import { restoreAuth } from "./redux/actions/authActions";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);
  return (
    <Router>
      <Header />
      <AppRouter />
      <Footer />
    </Router>
  );
}

export default App;
