import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, useTheme, Typography, CircularProgress } from "@mui/material";
import { Email, ErrorOutline, CheckCircle, ArrowBack, Lock, VpnKey } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('/auth/forgot-password', { email }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response?.data;
      console.log("FORGOT DATA", data);
      if (data) {
        setStep(2); // Passer à l'étape de vérification du code
      } else {
        console.log("ERROR", error);
        setError(data.error || "Une erreur s'est produite");
      }
    } catch (err) {
      console.log("ERROR", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('/auth/verify-reset-code', { email, code }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response?.data;
      console.log("VERIFY CODE DATA", data);
      if (data) {
        setStep(3); // Passer à l'étape de réinitialisation du mot de passe
      } else {
        setError(data.error || "Code de vérification invalide");
      }
    } catch (err) {
      console.log("ERROR", err);
      setError("Code de vérification invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    // Vérifier la longueur minimale du mot de passe
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/auth/reset-password', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response?.data;
      console.log("RESET PASSWORD DATA", data);
      if (data) {
        // Succès - rediriger vers la page de connexion
        navigate('/auth/login', { 
          state: { message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter." }
        });
      } else {
        setError(data.error || "Une erreur s'est produite lors de la réinitialisation");
      }
    } catch (err) {
      console.log("ERROR", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  const renderError = () => {
    if (!error) return null;
    
    return (
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
    );
  };

  // Étape 1: Demander l'email
  if (step === 1) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
          Mot de passe oublié
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
          Entrez votre adresse email pour recevoir un code de réinitialisation.
        </Typography>
        
        {renderError()}

        <Box component="form" onSubmit={handleEmailSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Adresse email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
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
              "Envoyer le code"
            )}
          </Button>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Vous vous souvenez de votre mot de passe ?{" "}
            <a 
              onClick={(e) => { e.preventDefault(); navigate("/auth/login"); }} 
              style={{ 
                color: theme.palette.primary.main, 
                textDecoration: "none", 
                fontWeight: 500, 
                cursor: "pointer" 
              }}
            >
              Se connecter
            </a>
          </Typography>
        </Box>
      </>
    );
  }

  // Étape 2: Vérifier le code
  if (step === 2) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
          Vérification du code
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
          Un code de vérification a été envoyé à <strong>{email}</strong>. Entrez ce code pour continuer.
        </Typography>
        
        {renderError()}

        <Box component="form" onSubmit={handleCodeSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Code de vérification"
            name="code"
            type="text"
            value={code}
            onChange={handleCodeChange}
            fullWidth
            margin="normal"
            required
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey fontSize="small" />
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
              "Vérifier le code"
            )}
          </Button>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            <a 
              onClick={(e) => { e.preventDefault(); setStep(1); setError(""); }} 
              style={{ 
                color: theme.palette.primary.main, 
                textDecoration: "none", 
                fontWeight: 500, 
                cursor: "pointer" 
              }}
            >
              Changer d'adresse email
            </a>
          </Typography>
        </Box>
      </>
    );
  }

  // Étape 3: Nouveau mot de passe
  if (step === 3) {
    return (
      <>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
          Nouveau mot de passe
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
          Choisissez un nouveau mot de passe pour votre compte.
        </Typography>
        
        {renderError()}

        <Box component="form" onSubmit={handlePasswordSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Nouveau mot de passe"
            name="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
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
          
          <TextField
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
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
              "Réinitialiser le mot de passe"
            )}
          </Button>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            <a 
              onClick={(e) => { e.preventDefault(); handleBackToLogin(); }} 
              style={{ 
                color: theme.palette.primary.main, 
                textDecoration: "none", 
                fontWeight: 500, 
                cursor: "pointer" 
              }}
            >
              Retour à la connexion
            </a>
          </Typography>
        </Box>
      </>
    );
  }
}