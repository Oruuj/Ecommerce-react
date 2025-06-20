import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import MainBanner from "../../components/Banners/MainBanner";
import Category from "../../components/Category/Category";
import Banners from "../../components/Banners/Banners";
import Products from "../../components/Products/Products";
import Discount from "../../components/Products/Discount";
import Banner2 from "../../components/Banners/Banner2";

const HomePage = () => {
  return (
    <>
      <header>
        <Header page="Home" />
      </header>
      <main>
        <MainBanner />
        <Category />
        <Products />
        <Banners />
        <Discount />
        <Banner2 />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default HomePage;
