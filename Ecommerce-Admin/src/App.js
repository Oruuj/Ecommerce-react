import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Product />} />
              <Route path="/productfeature" element={<ProductFeature />} />
              <Route path="/discount" element={<Discount />} />
              <Route path="/category" element={<Category />} />
              <Route path="/productslider" element={<ProductSlider />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/account" element={<Account />} />

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
