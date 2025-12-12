import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ChakraProvider>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
