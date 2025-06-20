import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './Banners.scss';
import { Link } from "react-router-dom";

const Banners = () => {
    const [sliderData, setSliderData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/ProductSlider/UI/GetAll');
                setSliderData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="banner-area flex items-center justify-center">
            <div className="banners banners-wrapper grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {sliderData?.map((slider, index) => (
                    <div className="banner" key={index} style={{ backgroundColor: "#EAEAEA" }}>
                        <div className="img">
                            <img src={`https://localhost:7279/${slider.imageUrl}`} alt={slider.name} />
                        </div>
                        <div className="content">
                            <p className='title font-semibold text-2xl'>{slider.name}</p>
                            <span className='desc'>{slider.desc}</span>
                        </div>
                        <Link
                            to={
                                slider.buttonUrl && slider.productId
                                    ? slider.buttonUrl + slider.productId
                                    : "/shop"
                            }
                            className="btn"
                        >
                            Shop Now
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banners;
