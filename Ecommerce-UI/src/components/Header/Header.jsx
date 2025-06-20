import React, { useState } from "react";
import "./Header.scss";
import { CiHeart } from "react-icons/ci";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = ({ page }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUser, setmenuUser] = useState(false);
  const [menuUserMobile, setmenuUserMobile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [Timeout, setTimeout] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    navigate("/account");
  };

  const performSearch = async (text) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://localhost:7279/api/Product/UI/Search?text=${encodeURIComponent(
          text.trim()
        )}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (Timeout) {
      clearTimeout(Timeout);
    }

    const timeoutId = setTimeout(() => {
      performSearch(value);
    }, 300);

    setTimeout(timeoutId);
  };

  return (
    <>
      <div className="header">
        <div className="header-container flex items-center justify-between p-4 bg-white">
          <div className="logo cursor-pointer" onClick={() => navigate("/")}>
            <h4 className="text-4xl">cyber</h4>
          </div>

          <div className="search hidden xl:flex relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded-md"
              value={searchText}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            <IoSearchOutline
              className="search-icon ml-2 text-2xl cursor-pointer"
              onClick={() => performSearch(searchText)}
            />

            {searchResults.length > 0 && (
              <div className="search-results absolute top-full left-0 right-0 bg-white border rounded-md shadow-md max-h-60 overflow-auto z-50 mt-1">
                <ul>
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate(`/Detail?id=${product.id}`);
                        setSearchText("");
                        setSearchResults([]);
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="links gap-6 text-lg hidden xl:flex">
            {page === "Home" ? (
              <>
                <Link to="/" className="active">
                  Home
                </Link>
                <Link to="/Shop">Shop</Link>
                <Link to="/contact">Contact Us</Link>
              </>
            ) : page === "Shop" ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/Shop" className="active">
                  Shop
                </Link>
                <Link to="/contact">Contact Us</Link>
              </>
            ) : page === "contact" ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/Shop">Shop</Link>
                <Link to="/contact" className="active">
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link to="/">Home</Link>
                <Link to="/Shop">Shop</Link>
                <Link to="/contact">Contact Us</Link>
              </>
            )}
          </div>

          <div
            className="menu flex xl:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <MdOutlineMenu className="menu-icon text-3xl" />
          </div>

          <div className="icons items-center gap-4 text-2xl ml-6 hidden xl:flex">
            <CiHeart
              className="cursor-pointer"
              onClick={() => navigate("/wishlist")}
            />
            <RiShoppingCart2Line
              className="cursor-pointer"
              onClick={() => navigate("/ShoppingCart")}
            />
            <FiUser
              className="cursor-pointer"
              onClick={() => setmenuUser((a) => !a)}
            />
          </div>
          <AnimatePresence>
            {menuUser && (
              <motion.div
                className="user-menu absolute bg-white border rounded-md shadow-md p-4 z-50"
                initial={{ x: 1000, y: 40, opacity: 0 }}
                animate={{ x: 1000, y: 50, opacity: 1 }}
                exit={{ x: 1000, y: 40, opacity: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                {!isLoggedIn ? (
                  <Link to="/account" className="block cursor-pointer mb-2">
                    Login or register
                  </Link>
                ) : (
                  <>
                    <Link to="/Profile" className="block mb-2">
                      Profile
                    </Link>
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
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="header-menu xl:hidden"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <IoMdClose
              className="text-3xl mb-4 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
            <div className="links gap-6 text-lg flex flex-col mt-5">
              {page === "Home" ? (
                <>
                  <Link to="/" className="active">
                    Home
                  </Link>
                  <Link to="/Shop">Shop</Link>
                  <Link to="contact">Contact Us</Link>
                </>
              ) : page === "Shop" ? (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/Shop" className="active">
                    Shop
                  </Link>
                  <Link to="/contact">Contact Us</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/Shop">Shop</Link>
                  <Link to="/contact">Contact Us</Link>
                </>
              )}
            </div>

            <div className="icons-mobile flex gap-4 text-2xl mt-auto">
              <CiHeart
                className="cursor-pointer"
                onClick={() => navigate("/wishlist")}
              />
              <RiShoppingCart2Line
                className="cursor-pointer"
                onClick={() => navigate("/ShoppingCart")}
              />
              <FiUser
                className="cursor-pointer"
                onClick={() => setmenuUserMobile((a) => !a)}
              />
            </div>
            <AnimatePresence>
              {menuUserMobile && (
                <motion.div
                  className="user-menu absolute bg-white border rounded-md shadow-md p-4 z-50"
                  initial={{ x: 25, y: 600, opacity: 0 }}
                  animate={{ x: 25, y: 477, opacity: 1 }}
                  exit={{ x: 25, y: 600, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                >
                  {!isLoggedIn ? (
                    <Link to="/account" className="block cursor-pointer mb-2">
                      Login or register
                    </Link>
                  ) : (
                    <>
                      <Link to="/Profile" className="block mb-2">
                        Profile
                      </Link>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
