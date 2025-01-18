import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  CardMedia,
  Typography,
} from "@mui/material";
import AddToCart from "../AddToCart/AddToCart";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import "./Modal.scss";
const Modal = ({ open, product, handleCloseModal }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <IconButton
        onClick={handleCloseModal}
        color="primary"
        className="closeModal"
      >
        <CloseIcon className="deliteCard" />
      </IconButton>
      <CardMedia
        component="img"
        height="100px"
        image={product.image}
        alt={product.name}
      />
      <DialogContent>
        <Typography component={"div"} variant="h5">
          {product.name}
        </Typography>
        <Typography component={"div"} variant="body3">
          {product.description}
        </Typography>
        <Typography>
          Price:
          <Typography component={"span"} variant="h6" color="secondary">
            {product.price}
          </Typography>
          $.
        </Typography>
        <Typography>{user && <AddToCart product={product} />}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
