import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux';
import theme from './styles/theme.js'
import AppProvider from './context/AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AppProvider>
    </Provider>
  </StrictMode>,
)
