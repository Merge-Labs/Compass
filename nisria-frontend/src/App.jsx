// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import ScreenSizeCheck from "./components/ScreenSizeCheck";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ScreenSizeCheck>
            <div className="App">
              <AppRoutes />
            </div>
          </ScreenSizeCheck>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
