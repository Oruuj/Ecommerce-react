import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import "./ShopProducts.scss";
import { useNavigate } from "react-router-dom";
import Product from "./Product";
import axios from "../../api/axios";

const ShopProducts = ({ selectedBrands, selectedCategories }) => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const brandsQuery = selectedBrands && selectedBrands.length > 0 ? `&brands=${selectedBrands.join(",")}` : "";
      const categoryQuery = selectedCategories && selectedCategories.length > 0 ? `&categories=${selectedCategories.join(",")}` : "";

      const response = await axios.get(`/api/Product/UI/GetWithPagination?page=${page}&pageSize=${pageSize}&sort=${sortOption}${brandsQuery}${categoryQuery}`);
      const data = response.data;
      setProducts(data.items || data);
      setTotalPages(data.totalPages || 1);
      console.log("Fetched products:", data.items || data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [page, sortOption, selectedBrands, selectedCategories]);
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setPage(1);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <div className="Container">
      <div className="title flex justify-between">
        <div className="count">
          <span>Selected Products: </span>
          <span>{products.length}</span>
        </div>
        <div className="filter" style={{ maxWidth: 200 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              id="sort"
              value={sortOption}
              label="Sort by"
              onChange={handleSortChange}
            >
              <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
              <MenuItem value="nameAsc">Name: A-Z</MenuItem>
              <MenuItem value="nameDesc">Name: Z-A</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-6 items-center">
        {products.map((product) => {
          const mainImage = `${product.productImages[0].image}`;
          return (
            <Product
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              oldPrice={product.oldPrice}
              quantity={product.stockquantity}
              image={mainImage}
            />
          );
        })}
      </div>

      <div className="pagination mt-10 flex justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          color="primary"
        />
      </div>
    </div>
  );
};

export default ShopProducts;
