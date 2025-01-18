import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box
    sx={{ bgcolor: "text.secondary", color: "white", p: 2 }}
    style={{ marginTop: "auto" }}
  >
    <Typography variant="body2" align="center">
      © 2024 E-Shop MERN
    </Typography>
  </Box>
);

export default Footer;
