import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import type { Stats } from "../types/types";
import api from "../utils/api";

const AdminPage = () => {
  const [userId, setUserId] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [discountResponse, setDiscountResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDiscount = async () => {
    setDiscountResponse(null);
    setError(null);
    try {
      const res = await api.get(`/admin/discount/${userId}`);
      setDiscountResponse(res.data.message + `: ${res.data.discountCode}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Error generating discount"
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleFetchStats = async () => {
    setStats(null);
    setError(null);
    try {
      const res = await api.get(`/admin/stats/${userId}`);
      setStats(res.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Error fetching stats"
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Admin Panel
        </Typography>
        <TextField
          fullWidth
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleGenerateDiscount}
          sx={{ mr: 2 }}
        >
          Generate Discount
        </Button>
        <Button variant="outlined" onClick={handleFetchStats}>
          Fetch Stats
        </Button>

        {discountResponse && (
          <Typography color="success.main" mt={2}>
            {discountResponse}
          </Typography>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        {stats && (
          <Card variant="outlined" sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6">Stats for {stats.userId}</Typography>
            <Typography>Total Orders: {stats.totalOrders}</Typography>
            <Typography>
              Total Items Purchased: {stats.totalItemsPurchased}
            </Typography>
            <Typography>Total Spent: ${stats.totalSpent}</Typography>
            <Typography>Total Discount: ${stats.totalDiscount}</Typography>
            <Typography>
              Discount Codes Used: {stats.discountCodes.join(", ") || "None"}
            </Typography>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPage;
