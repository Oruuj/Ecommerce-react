import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./scenes/unauthorized/unauthorized";

import ProductFeature from './scenes/productfeature/productfeature'
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Product from "./scenes/product/product";
import Discount from './scenes/Discount/discount'
import Category from "./scenes/category/category";
import ProductSlider from "./scenes/productslider/productslider";
import Setting from "./scenes/setting/setting";
import Slider from "./scenes/slider/slider";
import Account from "./scenes/account/account";
import Auth from "./scenes/Auth/Auth";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Product />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/productfeature"
                element={
                  <ProtectedRoute>
                    <ProductFeature />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discount"
                element={
                  <ProtectedRoute>
                    <Discount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category"
                element={
                  <ProtectedRoute>
                    <Category />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/productslider"
                element={
                  <ProtectedRoute>
                    <ProductSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/setting"
                element={
                  <ProtectedRoute>
                    <Setting />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/slider"
                element={
                  <ProtectedRoute>
                    <Slider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={theme.palette.mode}
            />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
