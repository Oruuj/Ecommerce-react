import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Topbar.css";

const Topbar = () => {
  const [menuUser, setMenuUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setMenuUser(false);
    navigate("/auth");
  };


  return (
    <div className="topbar">
      <Box display="flex" justifyContent="space-between" p={2} position="relative">

        <Box display="flex" alignItems="center" position="relative">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>

          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>

          <IconButton onClick={() => setMenuUser((prev) => !prev)}>
            <PersonOutlinedIcon />
          </IconButton>

          <AnimatePresence>
            {menuUser && (
              <motion.div
                className="user-menu"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 80 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                {!isLoggedIn ? (
                  <Link
                    to="/auth"
                    className="block cursor-pointer mb-2"
                    onClick={() => setMenuUser(false)}
                  >
                    Login or register
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleLogout}
                      className="block text-left cursor-pointer text-red-600"
                    >
                      Logout
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;
