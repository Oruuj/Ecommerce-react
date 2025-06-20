import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/Home/HomePage";
import ShopPage from "./pages/Shop/ShopPage";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import Wishlist from "./pages/wishlist/Wishlist";
import Account from "./pages/Account/Account";
import Detail from "./pages/Detail/Detail";
import Profile from "./pages/Profile/Profile";
import Contact from "./pages/Contact/contact";

import { BasketProvider } from './Context/BasketContext';
import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  };

  const pageTransition = { duration: 0.3 };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {[
          { path: "/", component: <HomePage /> },
          { path: "/Shop", component: <ShopPage /> },
          { path: "/ShoppingCart", component: <ShoppingCart /> },
          { path: "/Wishlist", component: <Wishlist /> },
          { path: "/Account", component: <Account /> },
          { path: "/Detail", component: <Detail /> },
          { path: "/Profile", component: <Profile /> },
          { path: "/Contact", component: <Contact /> },
        ].map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ minHeight: "100vh" }}
              >
                {component}
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ smooth: true });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <BasketProvider>
        <AnimatedRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </BasketProvider>
    </BrowserRouter>
  );
}

export default App;
