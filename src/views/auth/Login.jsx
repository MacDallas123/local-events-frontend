import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, IconButton, useTheme, Typography, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, ErrorOutline } from "@mui/icons-material";
import { Checkbox, FormControlLabel, Link } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearError, login } from "../../app/authReducer";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  // const target = useSelector((state) => state.auth.target);
  // const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    dispatch(clearError());
  };

  const handleShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(login(values));
    if(response.status == 200) navigate('/admin/dashboard'); 
  };

  return (
    <>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
            Connexion
        </Typography>
        {error && (
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(244, 67, 54, 0.12)", // red[500] with transparency
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                }}
            >
                <ErrorOutline sx={{ color: "error.main", mr: 1 }} />
                <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                    {error}
                </Typography>
            </Box>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            
        <TextField
            label="Adresse email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Email fontSize="small" />
                    </InputAdornment>
                ),
            }}
        />
        <TextField
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Lock fontSize="small" />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={remember}
                        onChange={e => setRemember(e.target.checked)}
                        color="primary"
                        size="small"
                    />
                }
                label={<Typography variant="body2">Se souvenir de moi</Typography>}
                sx={{ ml: 0 }}
            />
            <Link
                href="/auth/forgot-password"
                underline="hover"
                sx={{ fontSize: 14, color: theme.palette.primary.main, fontWeight: 500 }}
            >
                Mot de passe oublié ?
            </Link>
        </Box>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 600 }}
            disabled={loading}
        >
            {loading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                "Se connecter"
            )}
        </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
                Pas encore de compte ?{" "}
                <a onClick={(e) => { e.preventDefault(); navigate("/auth/register"); }} style={{ color: theme.palette.primary.main, textDecoration: "none", fontWeight: 500, cursor: "pointer" }}>
                    Créer un compte
                </a>
            </Typography>
        </Box>
    </>
  );
}
