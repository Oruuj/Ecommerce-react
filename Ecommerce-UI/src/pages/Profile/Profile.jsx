import { React, useState, useEffect } from "react";
import axios from "./../../api/axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import userimg from "../../assets/user.png";
import "./Profile.scss";
import { BiSolidUserDetail } from "react-icons/bi";
import { VscHome } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import Address from "../../components/Address/Address";
import Payment from "../../components/Payment/Payment";
import { Modal, Box, Typography, Button, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'react-toastify';

const Profile = () => {
  const [SelectedMenu, SetSelectedMenu] = useState("mydetail");
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentModal, setPaymentOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 48rem)");
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "70%" : 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 11,
    border: "none",
  };

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/Account/UI/GetProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFullName(response.data.fullName);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/Account/UI/UpdateProfile",
        { fullName, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <>
      <header><Header /></header>
      <main>
        <div className="container-profile">
          <section id="sidebar">
            <div className="profile">
              <div className="img"><img src={userimg} /></div>
              <div className="user-name">
                <span>Hi, </span>
                <span className="font-semibold text-2xl">{profile?.fullName || "Loading..."}</span>
              </div>
            </div>
            <div className="options">
              <div className="option" onClick={() => SetSelectedMenu("mydetail")}>
                <BiSolidUserDetail /><a>My detail</a>
              </div>
              <div className="option" onClick={() => SetSelectedMenu("address")}>
                <VscHome /><a>Address Book</a>
              </div>
              <div className="option" onClick={() => SetSelectedMenu("payment")}>
                <MdOutlinePayment /><a>Payment Methods</a>
              </div>
              <div className="option">
                <RiLogoutBoxLine /><a>Sign out</a>
              </div>
            </div>
          </section>

          <section id="content">
            <AnimatePresence mode="wait">
              {SelectedMenu === "mydetail" && (
                <motion.div
                  key="mydetail"
                  className="my-details"
                  initial={{ x: 0, y: 400, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={{ x: 0, y: -600, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                >
                  <div className="form">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button className="btn-apply" onClick={handleUpdateProfile}>
                    Apply
                  </button>
                </motion.div>
              )}

              {SelectedMenu === "address" && (
                <motion.div
                  key="address"
                  className="address-book"
                  initial={{ x: 0, y: 400, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={{ x: 0, y: -600, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                >
                  <div className="title">
                    <span className="font-semibold text-2xl">Address Book</span>
                    <button className="btn-address" onClick={() => setOpenModal(true)}>
                      Add Address
                    </button>
                  </div>
                  <div className="Addresses">
                    <div className="addresse grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7 mt-6 items-center">
                      <Address name="Home" address="Gara Garayev 73" />
                    </div>
                  </div>
                </motion.div>
              )}

              {SelectedMenu === "payment" && (
                <motion.div
                  key="payment"
                  className="address-book"
                  initial={{ x: 0, y: 400, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={{ x: 0, y: -600, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.3 }}
                >
                  <div className="title">
                    <span className="font-semibold text-2xl">Payment Method</span>
                    <button className="btn-address" onClick={() => setPaymentOpenModal(true)}>
                      Add Payment Method
                    </button>
                  </div>
                  <div className="Addresses">
                    <div className="addresse grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7 mt-6 items-center">
                      <Payment name="Card" address="43698214741" ValidDate="07 / 26" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={style}>
            <Typography variant="h6">Add a New Address</Typography>
            <input type="text" placeholder="Enter address Name" style={{ width: "100%", padding: "8px", marginBottom: "1rem" }} />
            <input type="text" placeholder="Enter address" style={{ width: "100%", padding: "8px", marginBottom: "1rem" }} />
            <div className="flex items-start gap-5">
              <Button variant="contained" onClick={() => setOpenModal(false)} style={{ backgroundColor: "black", borderRadius: 12 }}>Save</Button>
              <Button variant="contained" onClick={() => setOpenModal(false)} style={{ backgroundColor: "black", borderRadius: 12 }}>Close</Button>
            </div>
          </Box>
        </Modal>

        <Modal open={openPaymentModal} onClose={() => setPaymentOpenModal(false)}>
          <Box sx={style}>
            <Typography variant="h6">Add a New Payment</Typography>
            <input type="text" placeholder="Enter Card Number" style={{ width: "100%", padding: "8px", marginBottom: "1rem" }} />
            <input type="text" placeholder="Enter Expire Date" style={{ width: "100%", padding: "8px", marginBottom: "1rem" }} />
            <input type="text" placeholder="Enter CVV" style={{ width: "100%", padding: "8px", marginBottom: "1rem" }} />
            <div className="flex items-start gap-5">
              <Button variant="contained" onClick={() => setPaymentOpenModal(false)} style={{ backgroundColor: "black", borderRadius: 12 }}>Save</Button>
              <Button variant="contained" onClick={() => setPaymentOpenModal(false)} style={{ backgroundColor: "black", borderRadius: 12 }}>Close</Button>
            </div>
          </Box>
        </Modal>
      </main>
      <footer><Footer /></footer>
    </>
  );
};

export default Profile;
