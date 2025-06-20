import React, { useRef, useState, useEffect } from 'react';
import './Category.scss';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

const Category = () => {
    const scrollRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const scroll = (direction) => {
        const { current } = scrollRef;
        current.scrollBy({ left: direction === 'left' ? -800 : 800, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/Category/UI/GetAll');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    if (!categories || categories.length === 0) {
        return (<>
            <div className="category mb-10 mt-10"></div>
        </>);
    }

    return (
        <div className='category'>
            <div className="category-container mt-5">
                <div className="title-area flex justify-between mb-6">
                    <span className='title text-2xl font-semibold'>Browse By Category</span>
                    <div className="arrows flex gap-2 text-2xl">
                        <IoIosArrowBack className='arrow' onClick={() => scroll('left')} />
                        <IoIosArrowForward className='arrow' onClick={() => scroll('right')} />
                    </div>
                </div>
                <AnimatePresence>
                    <motion.div
                        className="categories-wrapper"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ type: "tween", duration: 0.3 }}
                        ref={scrollRef}
                    >
                        <div className="categories grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 items-center">
                            {categories.map((category) => (
                                <motion.div
                                    key={category.id}
                                    className="card"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => navigate(`/shop?category=${category.name.toLowerCase()}`)}
                                >
                                    {category.imageUrl?.trim() && (
                                        <img src={`https://localhost:7279/${category.imageUrl}`} />
                                    )}
                                    <span>{category.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Category;
