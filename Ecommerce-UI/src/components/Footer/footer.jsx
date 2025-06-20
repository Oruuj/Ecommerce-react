import React, { useEffect, useState } from 'react';
import './footer.scss';
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaTiktok } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import axios from '../../api/axios';

const Footer = () => {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/Setting/UI/GetAll');
                setSettings(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="footer">
            <div className='footer-container flex flex-col'>
                <div className="footer-text flex flex-col items-center justify-between p-4 white xl:flex-row">
                    <div className="about flex flex-col gap-4">
                        <p className='title text-lg font-bold'>cyber</p>
                        <span>{settings?.aboutText || "Loading about text..."}</span>
                    </div>
                    <div className="services flex flex-col gap-3">
                        <p className='title text-lg font-bold'>Services</p>
                        <p>Bonus program</p>
                        <p>Gift cards</p>
                        <p>Credit and payments</p>
                        <p>Service contracts</p>
                        <p>Non-cash account</p>
                        <p>Payment</p>
                    </div>
                    <div className="assistance flex flex-col gap-3">
                        <p className='title text-lg font-bold'>Assistance to the buyer</p>
                        <p>Find an order</p>
                        <p>Terms of delivery</p>
                        <p>Exchange and return of goods</p>
                        <p>Guarantee</p>
                        <p>Frequently asked questions</p>
                        <p>Terms of use of the site</p>
                    </div>
                </div>
                <div className="icons flex justify-between">
                    <a href={settings?.twitterUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <FaSquareXTwitter className='icon' />
                    </a>
                    <a href={settings?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className='icon' />
                    </a>
                    <a href={settings?.tiktokUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <FaTiktok className='icon' />
                    </a>
                    <a href={settings?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <BiLogoInstagramAlt className='icon' />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
