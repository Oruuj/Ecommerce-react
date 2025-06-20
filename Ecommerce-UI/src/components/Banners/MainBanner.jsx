import React, { useEffect, useState } from 'react';
import './MainBanner.scss';
import axios from '../../api/axios';

const MainBanner = () => {
    const [sliderData, setSliderData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/Slider/UI/GetById/1');
                setSliderData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='Banner'>
            <div className="container flex flex-col justify-around items-center">
                <div className="Content flex flex-col gap-5 ">
                    <p className='Title text-6xl'>{sliderData?.title || 'Loading...'}</p>
                    <span className='desc'>{sliderData?.description || ''}</span>
                    <button className='btn'>{sliderData?.buttonText || 'Loading..'}</button>
                </div>
                <div className="image">
                    {sliderData ? (
                        <img src={`https://localhost:7279/${sliderData.imageUrl}`} />
                    ) : (
                        <p>Loading image...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainBanner;
