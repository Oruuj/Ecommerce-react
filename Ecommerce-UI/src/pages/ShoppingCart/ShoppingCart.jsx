import React, { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/footer';
import { useBasket } from '../../Context/BasketContext';
import axios from '../../api/axios';
import './ShoppingCart.scss';

const ShoppingCart = () => {
    const { basket, fetchBasket, addItem, removeItem, updateItemQuantity } = useBasket();
    const userid = localStorage.getItem("userid");

    const [discounts, setDiscounts] = useState({});

    useEffect(() => {
        if (userid) {
            fetchBasket(userid);
        }
    }, [userid]);

    useEffect(() => {
        const fetchDiscounts = async () => {
            if (!basket?.items || basket.items.length === 0) return;

            const productIds = basket.items.map(item => item.productId);

            const discountPromises = productIds.map(async (pid) => {
                try {
                    const res = await axios.get(`/api/Discount/Admin/GetAllDiscountByProduct/${pid}`);
                    if (res.data.length > 0) {
                        return { productId: pid, discountPercentage: res.data[0].discountPercentage };
                    }
                    return { productId: pid, discountPercentage: 0 };
                } catch {
                    return { productId: pid, discountPercentage: 0 };
                }
            });

            const results = await Promise.all(discountPromises);
            const discountMap = {};
            results.forEach(d => {
                discountMap[d.productId] = d.discountPercentage;
            });
            setDiscounts(discountMap);
        };

        fetchDiscounts();
    }, [basket]);

    const subtotal = basket?.items?.reduce((sum, item) =>
        sum + Number(item.price) * item.quantity, 0
    ) || 0;

    const totalDiscount = basket?.items?.reduce((sum, item) => {
        const discountPercent = discounts[item.productId] || 0;
        if (discountPercent > 0) {
            const discountAmount = Number(item.price) * (discountPercent / 100);
            return sum + discountAmount * item.quantity;
        }
        return sum;
    }, 0) || 0;

    const total = subtotal - totalDiscount;

    const increaseQty = (item) => {
        updateItemQuantity(userid, item.productId, item.quantity + 1);
    };

    const decreaseQty = (item) => {
        if (item.quantity > 1) {
            updateItemQuantity(userid, item.productId, item.quantity - 1);
        } else {
            removeItem(userid, item.productId);
        }
    };

    return (
        <>
            <header><Header /></header>
            <main>
                <div className='cart-container'>
                    <div className='title text-2xl font-semibold'><span>Shopping Cart</span></div>
                    <div className='content'>
                        <div className='items flex flex-col items-center justify-start gap-4'>
                            {basket?.items?.length > 0 ? (
                                basket.items.map(item => {
                                    const discountPercent = discounts[item.productId] || 0;
                                    const discountedPrice = discountPercent > 0
                                        ? (Number(item.price) - (Number(item.price) * discountPercent / 100))
                                        : null;

                                    return (
                                        <div className='item flex items-center justify-between mt-5 mb-5' key={item.productId}>
                                            <img src={`https://localhost:7279/${item.image}`} alt={item.title} />
                                            <div className='text'><span>{item.title}</span></div>
                                            <div className='counter'>
                                                <span style={{ cursor: 'pointer' }} onClick={() => decreaseQty(item)}>-</span>
                                                <span className='count'>{item.quantity}</span>
                                                <span style={{ cursor: 'pointer' }} onClick={() => increaseQty(item)}>+</span>
                                            </div>
                                            <div className='price'>
                                                {discountedPrice !== null ? (
                                                    <>
                                                        <span className='line-through text-gray-500 text-sm font-semibold mr-2'>
                                                            ${Number(item.price)}
                                                        </span>
                                                        <span className='text-xl font-bold'>
                                                            ${discountedPrice}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className='text-gray-500 text-sm font-semibold mr-2'>
                                                        ${Number(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <MdCancel
                                                style={{ cursor: 'pointer' }}
                                                size={24}
                                                color='red'
                                                title='Remove item'
                                                onClick={() => removeItem(userid, item.productId)}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div>Your cart is empty</div>
                            )}
                        </div>

                        <div className='order-summary'>
                            <div className='title font-semibold text-3xl'>Order Summary</div>
                            <div className='inputs'>
                                <div className='input'>
                                    <span>Discount code / Promo code</span>
                                    <input type='text' placeholder='Code' />
                                </div>
                            </div>
                            <div className='desc'>
                                <div className='Subtotat flex justify-between'>
                                    <span>Subtotal</span>
                                    <span>${subtotal}</span>
                                </div>
                                <div className='discounts flex justify-between'>
                                    <span>Discount</span>
                                    <span>${totalDiscount}</span>
                                </div>
                                <div className='total flex justify-between'>
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                            <button className='btn mt-5'>Checkout</button>
                        </div>
                    </div>
                </div>
            </main>
            <footer><Footer /></footer>
        </>
    );
};

export default ShoppingCart;
