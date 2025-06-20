import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import Direction from "../../components/Directory/directory";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { LuMailMinus } from "react-icons/lu";
import "./Contact.scss";
import axios from '../../api/axios';

const Contact = () => {


  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/Setting/UI/GetAll');
        setSettings(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSettings();
  }, []);


  return (
    <>
      <header>
        <Header page="contact" />
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.section
            id="direction"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Direction directory={["Home", "Contact"]} />
          </motion.section>
        </AnimatePresence>
        <section id="contact-page">
          <AnimatePresence mode="wait">
            <motion.div
              className="container flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <span className="little-title">How can we help you? </span>
              <span className="title font-semibold text-3xl">Contact us</span>
              <p>
                {settings?.contactmessage}
              </p>
              <div className="contacts flex flex-col justify-between">
                <div className="contact">
                  <MdOutlineLocationOn />
                  <span>                {settings?.Address}</span>
                </div>
                <div className="contact">
                  <MdOutlinePhone />
                  <span>                {settings?.phone}
                  </span>
                </div>
                <div className="contact">
                  <LuMailMinus />
                  <span className="mail">                {settings?.email}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Contact;
