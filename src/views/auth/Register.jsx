import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, IconButton, useTheme, Typography, CircularProgress, Autocomplete, Select, MenuItem } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person, ErrorOutline, Phone, Numbers } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { clearError, register } from "../../app/authReducer";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "", telephone: "", confirmPassword: "", role: "user" });
  const theme = useTheme();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const response = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    dispatch(clearError());
  };

  const handleShowPassword = () => setShowPassword((show) => !show);

  const roles = [
    { label: "Utilisateur", value: "user" },
    { label: "Organisateur", value: "organizer" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(register(values));
    console.log("RESPONSE", response);
    if(response.status == 200 || response.status == 201) navigate('/auth/login'); 
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
        Inscription
      </Typography>
      {error && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            background: "rgba(244, 67, 54, 0.12)",
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
          label="Nom"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
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
          label="Telephone"
          name="telephone"
          type="number"
          value={values.telephone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        {/* <Autocomplete
          options={roles}
          getOptionLabel={(role) => role.label}
          value={(role) => role.value}
          onChange={(event, newValue) => {
              setValues({ ...values, role: newValue });
          }}
          renderInput={(params) => {
            <TextField {...params} label="Combo box" variant="outlined" />
          }}
        /> */}
        <Select
          value={values.role}
          name="role"
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          size="small"
          inputProps={{ 
            'aria-label' : 'Without label',
          }}
        >
          {roles?.map((role) =>  <MenuItem value={role.value}>{role.label}</MenuItem> )}
          <MenuItem></MenuItem>
        </Select>
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
        <TextField
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={values.confirmPassword}
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
            
          }}
        />
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
            "Créer un compte"
          )}
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Déjà inscrit ?{" "}
          <a onClick={(e) => { e.preventDefault(); navigate("/auth/login"); }} style={{ color: theme.palette.primary.main, textDecoration: "none", fontWeight: 500, cursor: "pointer" }}>
            Se connecter
          </a>
        </Typography>
      </Box>
    </>
  );
}
