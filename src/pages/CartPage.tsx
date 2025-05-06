import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import api from "../utils/api";
import { useEffect, useState } from "react";
import type { CartItem } from "../types/types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const userId = localStorage.getItem("userId") || "user1";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<{
    applied: boolean;
    amount: number;
  } | null>(null);
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isCodeValid, setIsCodeValid] = useState(false);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cart/${userId}`);
      const items = res.data.cart;
      setCart(items);

      const total = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity * item.price,
        0
      );
      setSubtotal(total);
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setError(err.response?.data?.error || "Failed to load cart");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDiscountCodes = async () => {
    try {
      const res = await api.get(`/cart/discount/${userId}`);
      if (res.data.availableDiscountCodes && res.data.availableDiscountCodes.length > 0) {
        setAvailableCodes(res.data.availableDiscountCodes);
        setDiscountCode(res.data.availableDiscountCodes[0]); // auto-fill the first available code
      } else {
        setAvailableCodes([]);
      }
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.error("Failed to fetch discount codes");
        setError(err.response?.data?.error || "Failed to fetch discount codes");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/${userId}/${itemId}`);
      fetchCart();
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setError(err.response?.data?.error || "Failed to remove item");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const checkout = async () => {
    try {
      const res = await api.post(`/checkout/${userId}`, {
        discountCode: discountCode || undefined,
      });

      setMessage(res.data.message);
      setCart([]);
      setDiscountInfo({
        applied: res.data.discountApplied,
        amount: res.data.discountAmount,
      });
      setAvailableCodes([]);
      setDiscountCode("");
      setIsCodeValid(false);
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setError(err.response?.data?.error || "Failed to checkout");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAvailableDiscountCodes();
  }, []);

  useEffect(() => {
    if (discountCode && availableCodes.includes(discountCode)) {
      setIsCodeValid(true);
    } else {
      setIsCodeValid(false);
    }
  }, [discountCode, availableCodes]);

  const discountAmount = isCodeValid ? subtotal * 0.1 : 0;
  const finalTotal = subtotal - discountAmount;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Cart</Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>

      {availableCodes.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>You're eligible for a discount!</AlertTitle>
          Use code <strong>{availableCodes[0]}</strong> at checkout to save 10%.
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : cart.length === 0 ? (
        <Typography>No items in cart</Typography>
      ) : (
        <>
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
                  primary={`Item Name: ${item.itemName}`}
                  secondary={`Qty: ${item.quantity} | Price: $${item.price}`}
                />
              </ListItem>
            ))}
          </List>

          <Box mt={2}>
            <Typography variant="subtitle1">Subtotal: ${subtotal.toFixed(2)}</Typography>
            {isCodeValid && (
              <>
                <Typography variant="subtitle1" color="green">
                  Discount: -${discountAmount.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Final Total: ${finalTotal.toFixed(2)}
                </Typography>
              </>
            )}
          </Box>

          <TextField
            label="Discount Code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            helperText={
              discountCode.length > 0
                ? isCodeValid
                  ? "Valid discount code"
                  : "Invalid or unavailable discount code"
                : ""
            }
            error={discountCode.length > 0 && !isCodeValid}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={checkout}
            disabled={cart.length === 0 || (!!discountCode && !isCodeValid)}
            sx={{ mt: 2 }}
          >
            Checkout
          </Button>
        </>
      )}

      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {discountInfo && (
        <Alert severity={discountInfo.applied ? "success" : "info"} sx={{ mt: 2 }}>
          {discountInfo.applied
            ? `Discount applied! You saved $${discountInfo.amount.toFixed(2)}`
            : "No discount applied"}
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
