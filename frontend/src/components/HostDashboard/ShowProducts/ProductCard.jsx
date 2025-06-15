import { Card, CardContent, CardMedia, Typography, CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../../features/ProductSlice';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onEdit = () => {
    navigate(`/editProduct/${product._id}`, { state: { product } });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(product._id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        className="product-image"
        image={product.imageUrl?.url || '/placeholder-product.png'}
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-product.png';
        }}
      />
      <CardContent className="product-content">
        <Typography gutterBottom variant="h6" component="div" className="product-name">
          {product.name}
        </Typography>
        <Typography variant="body2" className="product-detail">
          <b>Brand:</b> {product.brand}
        </Typography>
        <Typography variant="body2" className="product-detail">
          <b>Strength:</b> {product.strength}
        </Typography>
        <Typography variant="body2" className="product-detail">
          <b>Form:</b> {product.form}
        </Typography>
        <Typography variant="h6" className="product-price">
          ₹{product.price}
          {product.mainPrice && (
            <span style={{ 
              textDecoration: 'line-through', 
              color: '#9e9e9e',
              fontSize: '0.875rem',
              marginLeft: '8px'
            }}>
              ₹{product.mainPrice}
            </span>
          )}
        </Typography>
      </CardContent>
      <CardActions className="product-actions">
        <Button 
          size="small" 
          variant="contained" 
          onClick={onEdit}
          className="edit-btn"
          sx={{
            fontWeight: 600,
            px: 2,
            py: 1
          }}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          variant="outlined" 
          color="error" 
          onClick={handleDelete}
          className="delete-btn"
          sx={{
            fontWeight: 600,
            px: 2,
            py: 1
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;