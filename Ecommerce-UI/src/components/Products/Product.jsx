import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./Product.scss";
import { useBasket } from '../../Context/BasketContext';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { CiHeart } from "react-icons/ci";

const Product = ({ id, title, image, price }) => {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const { addItem } = useBasket();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.some(item => item.productId === id);
    setIsWishlisted(exists);
  }, [id]);

  // Fetch discount info on mount or when id changes
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await axios.get(`/api/Discount/Admin/GetAllDiscountByProduct/${id}`);
        if (res.data.length > 0) {
          setDiscount(res.data[0]);
        } else {
          setDiscount(null);
        }
      } catch (error) {
        console.error("Error fetching discount:", error);
      }
    };

    fetchDiscount();
  }, [id]);

  // Calculate discounted price
  const discountedPrice = discount
    ? parseFloat((price - (price * discount.discountPercentage) / 100).toFixed(2))
    : null;

  // Countdown timer effect
  useEffect(() => {
    if (!discount || !discount.endDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(discount.endDate);
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();

    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, [discount]);

  // Handle add to basket
  const handleAddToBasket = async () => {
    try {
      const buyerId = localStorage.getItem("userid");
      if (!buyerId) {
        toast.error("Please log in to add items to your basket.");
        return;
      }

      const product = {
        productId: id,
        productName: title,
        price: parseFloat(price),
        discountedPrice: discountedPrice !== null ? parseFloat(discountedPrice) : null,
        quantity: 1,
        image: image
      };

      await addItem(buyerId, product);
      toast.success("Item added to basket!");
    } catch (err) {
      toast.error("Failed to add item.");
      console.error(err);
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (isWishlisted) {
      const newWishlist = wishlist.filter(item => item.productId !== id);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      setIsWishlisted(false);
      toast.info("Item removed from wishlist");
    } else {
      const newItem = {
        productId: id,
        title,
        price: parseFloat(price),
        discountedPrice: discountedPrice !== null ? discountedPrice : null,
        image
      };
      wishlist.push(newItem);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast.success("Item added to wishlist");
    }
  };

  return (
    <div className="product relative flex flex-col justify-evenly items-center border p-4 rounded-lg">
      {discount && (
        <div className="discount-badge absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{discount.discountPercentage}% OFF
        </div>
      )}
      <CiHeart
        onClick={toggleWishlist}
        size={28}
        style={{
          cursor: "pointer",
          color: isWishlisted ? "red" : "gray",
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          transition: "color 0.3s ease",
        }}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      />

      <div className="img cursor-pointer" onClick={() => navigate(`/Detail?id=${id}`)}>
        <img src={`https://localhost:7279/${image}`} alt={title} />
      </div>

      <div className="content flex flex-col justify-evenly items-center text-center mt-2 w-full">
        <p className="title font-medium cursor-pointer" onClick={() => navigate(`/Detail?id=${id}`)}>{title}</p>
        <div className="price">
          {discount ? (
            <>
              <span className="line-through text-gray-500 text-sm font-semibold mr-2">
                ${parseFloat(price).toFixed(2)}
              </span>
              <span className="text-xl font-bold">${discountedPrice}</span>
            </>
          ) : (
            <span className="text-xl font-bold">${parseFloat(price)}</span>
          )}
        </div>

        {timeLeft && (
          <div className="countdown text-sm mt-1 text-red-600 font-semibold">
            Discount ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        )}

        <div className="btns flex items-center justify-center gap-2 mt-3">
          <button className="cart" onClick={handleAddToBasket}>
            Add To Cart
          </button>
          <button className="btn">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Product;
