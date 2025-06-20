import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import "./Account.scss";
import { motion, AnimatePresence } from "framer-motion";
import axios from "./../../api/axios";


const Account = () => {
  const [isLogin, SetisLogin] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSmall, setIsMobileSmall] = useState(true);
  const [isMobileSmallByWidthHeight, setIsMobileSmallByWidthHeight] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsMobileSmall(window.innerWidth < 768);
      setIsMobileSmallByWidthHeight(
        window.innerWidth < 768 && window.innerHeight < 690
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const [loginData, setLoginData] = useState({
    userNameOrEmail: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");


  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "/api/Account/UI/Login",
        {
          userNameOrEmail: loginData.userNameOrEmail,
          password: loginData.password
        }
      );
      if (response.data.succes) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userid", response.data.userId);
      }
      setMessage("Login successful!");
    } catch (error) {
      const backendMessage = error.response?.data?.ErrorMessage || "Login failed. Please try again.";
      setMessage(backendMessage);
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (registerData.password !== registerData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        userName: registerData.userName
      };

      const response = await axios.post(
        "/api/Account/UI/Register",
        payload
      );
      setMessage("Registration successful! Please check your email.");
      SetisLogin(true);
      setRegisterData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <div className="account">
          <div className="account-container">
            <AnimatePresence>
              {isLogin ? (
                <motion.div
                  className="title reg absolute"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{
                    x: isMobileSmall ? -15 : isMobile ? 30 : 0,
                    y: isMobileSmallByWidthHeight
                      ? 287
                      : isMobileSmall
                        ? 475
                        : 0,
                    opacity: 1,
                  }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.6 }}
                >
                  <span>Haven't registered yet?</span>
                  <button onClick={() => SetisLogin(false)}>Register</button>
                </motion.div>
              ) : (
                <motion.div
                  className="title login absolute"
                  initial={{
                    x: isMobileSmall ? 0 : isMobile ? -300 : -350,
                    opacity: 0,
                  }}
                  animate={{
                    x: isMobileSmall ? 165 : isMobile ? -90 : -480,
                    y: isMobileSmallByWidthHeight ? -42 : 0,
                    opacity: 1,
                  }}
                  exit={{ x: -400, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.6 }}
                >
                  <span>Already have an account?</span>
                  <button onClick={() => SetisLogin(true)}>Login</button>
                </motion.div>
              )}
              {isLogin ? (
                <motion.div
                  className="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 1 }}
                >
                  <h2 className="text-2xl font-semibold mb-10">Login</h2>
                  <form className="flex flex-col" onSubmit={handleLoginSubmit}>
                    <input type="text" name="userNameOrEmail" placeholder="Email or Username" value={loginData.userNameOrEmail} onChange={handleLoginChange} required />
                    <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Password" required />
                    <button type="submit">Login</button>
                  </form>
                  {message && <p className="message">{message}</p>}
                </motion.div>
              ) : (
                <div className="login bg-black"></div>
              )}

              {isLogin ? (
                <div className="register bg-black"></div>
              ) : (
                <motion.div
                  className="register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "tween", duration: 1 }}
                >
                  <h2 className="text-2xl font-semibold mb-10">Register</h2>
                  <form className="flex flex-col" onSubmit={handleRegisterSubmit}>
                    <input type="text" name="fullName" value={registerData.fullName} onChange={handleRegisterChange} placeholder="Full Name" required />
                    <input type="text" name="userName" value={registerData.userName} onChange={handleRegisterChange} placeholder="Username" required />
                    <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
                    <input type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirm Password"
                      required
                    />
                    <button type="submit">Register</button>
                  </form>
                  {message && <p className="message">{message}</p>}

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Account;
