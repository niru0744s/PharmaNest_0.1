import { Card, CardContent, CardMedia, Typography , CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { showProduct } from '../../../features/ProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct } from '../../../features/ProductSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onEdit = () => {
    navigate(`/editProduct/${product._id}`, { state: { product } });
  };
  const handleDelete = async ()=>{
    try {
      dispatch(deleteProduct(product._id));
    } catch (error) {
      toast.error(error);
    }
  }
  return (
    <Card className="m-2" style={{ maxWidth: 250, minHeight: 380 }}>
      <CardMedia
        component="img"
        height="160"
        image={product.imageUrl.url}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Brand:</b> {product.brand}<br />
          <b>Strength:</b> {product.strength}<br />
          <b>Price:</b> ₹{product.price}
        </Typography>
      </CardContent>
      <CardActions className='ms-3'>
        <Button size="small" variant="contained" onClick={onEdit}>Edit</Button>
        <Button size="small" variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
