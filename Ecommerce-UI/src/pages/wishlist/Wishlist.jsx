import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/footer';
import { useBasket } from '../../Context/BasketContext';
import { toast } from 'react-toastify';
import './wishlist.scss';

const Wishlist = () => {
    const { addItem } = useBasket();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(savedWishlist);
    }, []);

    const removeFromWishlist = (productId) => {
        const updated = wishlist.filter(item => item.productId !== productId);
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    const handleAddToCart = (item) => {
        const buyerId = localStorage.getItem('userid');
        if (!buyerId) {
            toast.error("Please log in to add items to your basket.");
            return;
        }
        addItem(buyerId, {
            productId: item.productId,
            productName: item.title,
            price: item.price,
            discountedPrice: item.discountedPrice || null,
            quantity: 1,
            image: item.image
        });
        toast.success("Item added to basket!");
    };

    return (
        <>
            <header>
                <Header />
            </header>
            <main>
                <div className="wishlist">
                    <div className="wishlist-container">
                        {wishlist.length === 0 ? (
                            <div className='empty-wishlist flex items-center justify-center'>Your wishlist is empty.</div>
                        ) : (
                            <div className="items flex flex-col items-center gap-5">
                                {wishlist.map(item => (
                                    <div className="item flex items-center justify-between" key={item.productId}>
                                        <div className="img">
                                            <img src={`https://localhost:7279/${item.image}`} alt={item.title} />
                                        </div>
                                        <div className="title">{item.title}</div>
                                        <div className="price">
                                            {item.discountedPrice ? (
                                                <>
                                                    <span className="line-through text-gray-500 text-sm font-semibold mr-2">
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                    <span className="text-xl font-bold">${item.discountedPrice.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <div className="btns">
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromWishlist(item.productId)}
                                            >
                                                Remove
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => handleAddToCart(item)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default Wishlist;
