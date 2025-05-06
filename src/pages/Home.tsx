import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Container,
  Grid,
  Box,
} from "@mui/material";
import type { Product } from "../types/types";
import api from "../utils/api";
import { getCurrentUser } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/items");
        console.log(res.data);
        setProducts(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.message) {
          setError(err.message);
        } else {
          setError("Failed to fetch products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Product List</Typography>
        <Button variant="outlined" onClick={() => navigate("/cart")}>
          Go to Cart
        </Button>
      </Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>Price: ${product.price}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const addToCart = async (itemId: string) => {
  const userId = getCurrentUser();
  if (!userId) return alert("User not found");

  try {
    await api.post(`/cart/${userId}`, {
      itemId,
      quantity: 1,
    });
    alert("Item added to cart");
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      console.error(err.message);
      alert("Failed to add to cart");
    } else {
      console.error("An unknown error occurred");
    }
  }
};

export default HomePage;
