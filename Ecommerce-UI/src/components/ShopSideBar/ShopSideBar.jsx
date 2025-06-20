import React, { useState, useRef, useEffect } from 'react';
import axios from '../../api/axios';
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import './ShopSideBar.scss';
const ShopSideBar = ({ selectedBrands, setSelectedBrands, selectedCategories, setSelectedCategories }) => {
    const [openSections, setOpenSections] = useState({
        brand: true,
        category: true,
    });

    const [heights, setHeights] = useState({});

    const brandRef = useRef(null);
    const categoryRef = useRef(null);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/Category/UI/GetAll');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setHeights(prev => ({
            brand: openSections.brand ? `${brandRef.current?.scrollHeight}px` : "0px",
            category: openSections.category ? `${categoryRef.current?.scrollHeight}px` : "0px",
        }));
    }, [openSections, categories]);

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const onBrandChange = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const onCategoryChange = (categoryName) => {
        if (selectedCategories.includes(categoryName)) {
            setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
        } else {
            setSelectedCategories([...selectedCategories, categoryName]);
        }
    };

    const isBrandChecked = (brand) => selectedBrands.includes(brand);
    const isCategoryChecked = (categoryName) => selectedCategories.includes(categoryName);

    return (
        <div className='Features'>
            <div className="feature mb-5">
                <div className="title flex justify-between items-center cursor-pointer" onClick={() => toggleSection('brand')}>
                    <span>Brand</span>
                    <div className="icons flex">
                        {openSections.brand ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                </div>
                <hr className='mb-5' />
                <div
                    className="values-wrapper"
                    style={{ height: heights.brand, overflow: 'hidden', transition: 'height 0.3s ease' }}
                    ref={brandRef}
                >
                    <div className="values">
                        <div className="checkboxes">
                            {["Apple", "Samsung", "Sony"].map((brand) => (
                                <div key={brand}>
                                    <input
                                        type="checkbox"
                                        id={brand.toLowerCase()}
                                        checked={isBrandChecked(brand)}
                                        onChange={() => onBrandChange(brand)}
                                    />
                                    <label htmlFor={brand.toLowerCase()}> {brand}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="feature mb-5">
                <div className="title flex justify-between items-center cursor-pointer" onClick={() => toggleSection('category')}>
                    <span>Category</span>
                    <div className="icons flex">
                        {openSections.category ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                </div>
                <hr className='mb-5' />
                <div
                    className="values-wrapper"
                    style={{ height: heights.category, overflow: 'hidden', transition: 'height 0.3s ease' }}
                    ref={categoryRef}
                >
                    <div className="values">
                        <div className="checkboxes">
                            {categories.length === 0 ? (
                                <p>Loading categories...</p>
                            ) : (
                                categories.map(category => (
                                    <div key={category.name}>
                                        <input
                                            type="checkbox"
                                            id={`category-${category.name}`}
                                            checked={isCategoryChecked(category.name)}
                                            onChange={() => onCategoryChange(category.name)}
                                        />
                                        <label htmlFor={`category-${category.name}`}> {category.name}</label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopSideBar;
