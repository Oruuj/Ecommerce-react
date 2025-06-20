import React, { useEffect, useState } from 'react';
import './Banner2.scss';
import axios from '../../api/axios';

const Banner2 = () => {
    const [sliderData, setSliderData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/Slider/UI/GetById/2');
                setSliderData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div
            className='banner'
            style={{
                backgroundImage: sliderData?.imageUrl
                    ? `url("https://localhost:7279/${sliderData.imageUrl}")`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="content items-center gap-9">
                <div className="text">
                    <span className='title font-semibold mb-4'>{sliderData?.title}</span>
                    <span className='desc'>{sliderData?.description}</span>
                </div>
                <button className='btn'>{sliderData?.buttonText}</button>
            </div>
        </div>
    );
};

export default Banner2;
