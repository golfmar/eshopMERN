import React from "react";
import { Dialog, DialogContent, Typography } from "@mui/material";
const ModalMessage = ({ open, message }) => {
  return (
    <Dialog
      open={open}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <DialogContent>
        <Typography component={"p"}>{message}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMessage;
