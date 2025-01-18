import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const ProductCard = ({ product }) => (
  <Card>
    <CardMedia
      component="img"
      height="140"
      image={product.image}
      alt={product.name}
    />
    <CardContent>
      <Typography variant="h5">{product.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {product.description}
      </Typography>
      <Typography variant="h6">{product.price} руб.</Typography>
    </CardContent>
  </Card>
);

export default ProductCard;
