import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Product from '../Products/Product'; // Make sure this path and component name are correct
import './Discount.scss';

const Discount = () => {
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/Product/UI/GetAllWithInclude');
                console.log('Fetched product data:', response.data); // Debugging line
                setProductData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredDiscountedProducts = productData.filter(product =>
        product.discounts?.some(d => d.discountPercentage >= 50)
    );

    if (loading) {
        return <div>Loading discounts...</div>;
    }

    if (filteredDiscountedProducts.length === 0) {
        return <div>No discounted products found.</div>;
    }

    return (
        <div className="discount-area">
            <div className="discount-container">
                <div className="title">
                    <span className="text-2xl font-semibold">Discounts over 50%</span>
                </div>
                <div className="products grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-6 items-center">
                    {filteredDiscountedProducts.map(product => {
                        const discount = product.discounts.find(d => d.discountPercentage >= 50);
                        const discountedPrice = discount
                            ? +(product.price * (1 - discount.discountPercentage / 100)).toFixed(2)
                            : product.price;

                        return (
                            <Product
                                key={product.id}
                                id={product.id}
                                title={product.name}
                                price={discountedPrice}
                                oldPrice={product.price}
                                quantity={product.stockquantity}
                                image={product.productImages?.[0]?.image}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Discount;
