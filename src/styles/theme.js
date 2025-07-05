import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // Bleu dynamique
    },
    secondary: {
      main: "#ff9800", // Orange vif
    },
    dark: {
      default: "#0f1535"
    },
    background: {
      default: "#f5f6fa",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff', // Double assurance
        },
      },
    },
  },
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
  }
});

export default theme;
