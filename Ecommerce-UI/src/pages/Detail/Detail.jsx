import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../api/axios";
import "./Detail.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/footer";
import Directory from "../../components/Directory/directory";
import { motion, AnimatePresence } from "framer-motion";
import Product from "../../components/Products/Product";

const useQuery = () => new URLSearchParams(useLocation().search);

const Detail = () => {
  const query = useQuery();
  const id = query.get("id");

  const [productData, setProductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [discount, setDiscount] = useState(null);
  const [selectedColor, setSelectedColor] = useState("red");
  const [showMore, setShowMore] = useState(false);
  const colors = ["red", "blue", "black", "yellow"];

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/Product/UI/GetByIdWithInclude/${id}`);
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchDiscount = async () => {
      try {
        const response = await axios.get(`/api/Discount/Admin/GetAllDiscountByProduct/${id}`);
        if (response.data.length > 0) {
          setDiscount(response.data[0]);
        } else {
          setDiscount(null);
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
        setDiscount(null);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(`/api/Product/UI/GetAllWithInclude`);
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchProduct();
    fetchDiscount();
    fetchRelatedProducts();
  }, [id]);

  const discountedPrice =
    discount && productData
      ? (productData.price * (1 - discount.discountPercentage / 100))
      : null;

  return (
    <>
      <Header />
      <main>
        <Directory directory={["Home", "Catalog", productData?.category?.name || "Product"]} />
        <section id="detail-page">
          <div className="container">
            <div className="product-detail mt-5 mb-5">
              <div className="img-detail">
                <div className="images">
                  {productData?.productImages?.map((img, i) => (
                    <img key={i} src={`https://localhost:7279/${img.image}`} alt={`preview-${i}`} />
                  ))}
                </div>

                <div className="main-img">
                  <img
                    src={
                      productData?.productImages?.find((img) => img.mainImage)
                        ? `https://localhost:7279/${productData.productImages.find((img) => img.mainImage).image}`
                        : productData?.productImages?.[0]
                          ? `https://localhost:7279/${productData.productImages[0].image}`
                          : ""
                    }
                    alt="Main"
                  />
                </div>
              </div>

              <div className="content">
                <div className="title text-2xl font-semibold">{productData?.name}</div>
                <div className="price">
                  {discountedPrice ? (
                    <>
                      <span className="line-through text-gray-500 text-sm font-semibold mr-2">
                        ${productData.price.toFixed(2)}
                      </span>
                      <span className="text-xl font-bold">${discountedPrice}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">${productData?.price?.toFixed(2)}</span>
                  )}
                </div>

                <div className="colors-options flex items-center mt-2">
                  <span>Select color:</span>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-circle ${selectedColor === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>

                <div className="storage mt-3">
                  <span>128GB</span>
                  <span>256GB</span>
                  <span>512GB</span>
                  <span className="selected">1TB</span>
                </div>

                <div className="features grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                  {productData?.productFeatures
                    ?.map((f, i) =>
                      i < 6 ? (
                        <div key={i} className="feature">
                          <span className="title font-medium text-gray-600">{f.name}</span>
                          <span>{f.value}</span>
                        </div>
                      ) : null
                    )}
                </div>

                <div className="btns mt-5">
                  <button className="wishlist">Add to Wishlist</button>
                  <button className="add">Add to Cart</button>
                </div>
              </div>
            </div>

            <div className="details">
              <span className="details-title">Detail</span>
              <div className="desc">
                <p>{productData?.description}</p>
              </div>

              <div className="features mb-9">
                <AnimatePresence>
                  {showMore && (
                    <motion.div
                      className="feature-group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="feature">
                        <span className="title">More Specifications</span>
                        {productData?.productFeatures
                          ?.map((f, i) =>
                            i >= 6 ? (
                              <div
                                key={i}
                                className="feature-detail flex items-center justify-between"
                              >
                                <span>{f.name}</span>
                                <span>{f.value}</span>
                              </div>
                            ) : null
                          )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="btns-show flex flex-col items-center">
                  <button className="btn-show" onClick={() => setShowMore((prev) => !prev)}>
                    {showMore ? "Show Less" : "Show More"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="relateds">
          <div className="container">
            <div className="title">
              <span className="font-semibold text-2xl">Related Products</span>
            </div>
            <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-6 items-center mb-8">
              {relatedProducts
                ?.filter((p) => p.category?.id === productData?.category?.id && p.id !== productData?.id)
                .slice(0, 4)
                ?.map((p) => (
                  <Product
                    key={p.id}
                    id={p.id}
                    title={p.name}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    image={
                      p?.productImages?.find((img) => img.mainImage)?.image ||
                      p?.productImages?.[0]?.image
                    }
                  />
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Detail;
