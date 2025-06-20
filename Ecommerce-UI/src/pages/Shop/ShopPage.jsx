import React, { useState, useEffect } from "react";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/footer';
import Directory from '../../components/Directory/directory';
import ShopSideBar from '../../components/ShopSideBar/ShopSideBar'
import ShopProducts from '../../components/Products/ShopProducts';
import { useLocation } from "react-router-dom";
const useQuery = () => new URLSearchParams(useLocation().search);

const ShopPage = () => {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);


    const query = useQuery();
    const category = query.get("category");

    useEffect(() => {
        if (category && !selectedCategories.includes(category)) {
            setSelectedCategories(prev => [...prev, category]);
        }
    }, [category]);
    return (
        <>
            <header>
                <Header page="Shop" />
            </header>
            <main>
                <div className="container flex flex-col" style={{ maxWidth: '1120px', marginLeft: 'auto', marginRight: 'auto' }}>
                    < Directory directory={['Home', 'Catalog', 'SmartPhones']} />
                    <div className="content flex justify-between gap-10">
                        <ShopSideBar selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
                        <ShopProducts selectedBrands={selectedBrands} selectedCategories={selectedCategories} />
                    </div>
                </div>
            </main >
            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default ShopPage