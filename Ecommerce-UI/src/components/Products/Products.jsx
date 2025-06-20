import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./Products.scss";
import { useNavigate } from "react-router-dom";
import Product from "./Product";
import axios from "../../api/axios";

const tabMap = ["new", "best"];

const Products = () => {
  const [value, setValue] = useState(0);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/Product/UI/GetAllWithInclude");
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const now = new Date();

  const filteredProducts =
    value === 0
      ? productData
        .filter((p) => {
          const createdDate = new Date(p.createdAt);
          const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
          return daysDiff <= 30;
        }).slice(0, 8)
      : productData.slice().sort((a, b) => b.stockQuantity - a.stockQuantity).slice(0, 8);
  return (
    <div className="product-area">
      <div className="product-container">
        <div className="title">
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                "& .MuiTab-root": { color: "gray", fontWeight: "semibold" },
                "& .Mui-selected": { color: "black !important" },
                "& .MuiTabs-indicator": { backgroundColor: "black" },
              }}
            >
              <Tab label="New Arrival" disableRipple />
              <Tab label="Best Seller" disableRipple />
            </Tabs>
          </Box>
        </div>
        <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-6 items-center">
          {filteredProducts.map((product) => (
            <Product
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              quantity={product.stockquantity}
              oldPrice={
                product.discounts?.[0]?.oldPrice || product.price
              }
              image={
                product.productImages?.[0]?.image
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
