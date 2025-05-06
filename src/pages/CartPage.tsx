import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from "@mui/material";
import api from "../utils/api";
import { useEffect, useState } from "react";
import type { CartItem } from "../types/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const userId = localStorage.getItem("userId") || "user1";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cart/${userId}`);
      console.log(res.data);
      setCart(res.data.cart);
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.error(err.message);
        setError(err.response?.data?.error || "Failed to load cart");
      } else {
        console.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/${userId}/${itemId}`);
      fetchCart();
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.error(err.message);
        setError(err.response?.data?.error || "Failed to load cart");
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const checkout = async () => {
    try {
      const res = await api.post(`/checkout/${userId}`);
      setMessage(res.data.message);
      setCart([]); // clear cart
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.error(err.message);
        setError(err.response?.data?.error || "Failed to load cart");
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Cart</Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : cart.length === 0 ? (
        <Typography>No items in cart</Typography>
      ) : (
        <List>
          {cart.map((item: CartItem) => (
            <ListItem
              key={item.itemId}
              secondaryAction={
                <IconButton edge="end" onClick={() => removeItem(item.itemId)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`Item ID: ${item.itemId}`}
                secondary={`Qty: ${item.quantity} | Price: $${item.price}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={checkout}
        disabled={cart.length === 0}
        sx={{ mt: 2 }}
      >
        Checkout
      </Button>

      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}
