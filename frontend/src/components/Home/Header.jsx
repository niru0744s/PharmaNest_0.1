import './Header.css';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className="header-container">
            <div className="header-grid">
                <Link className="header-category" to="/product/Medicine">
                    <div className="category-icon">
                        <img src="/media/headerImg/img1.png" alt="Medicines" />
                    </div>
                    <p className="category-title">Medicines</p>
                    <div className="hover-indicator"></div>
                </Link>

                <Link className="header-category" to="/product/OTC_Medicine">
                    <div className="category-icon">
                        <img src="/media/headerImg/img2.png" alt="OTC Medicines" />
                    </div>
                    <p className="category-title">OTC Medicines</p>
                    <div className="hover-indicator"></div>
                </Link>

                <Link className="header-category" to="/product/First_Aid">
                    <div className="category-icon">
                        <img src="/media/headerImg/img3.png" alt="First Aid" />
                    </div>
                    <p className="category-title">First Aid</p>
                    <div className="hover-indicator"></div>
                </Link>

                <Link className="header-category" to="/product/Hygiene">
                    <div className="category-icon">
                        <img src="/media/headerImg/img4.png" alt="Hygiene" />
                    </div>
                    <p className="category-title">Hygiene</p>
                    <div className="hover-indicator"></div>
                </Link>

                <Link className="header-category" to="/product/Baby_product">
                    <div className="category-icon">
                        <img src="/media/headerImg/img7.png" alt="Baby Products" />
                    </div>
                    <p className="category-title">Baby Products</p>
                    <div className="hover-indicator"></div>
                </Link>

                <Link className="header-category" to="/product/Supplements">
                    <div className="category-icon">
                        <img src="/media/headerImg/img6.png" alt="Supplements" />
                    </div>
                    <p className="category-title">Supplements</p>
                    <div className="hover-indicator"></div>
                </Link>

                <Link className="header-category" to="/product/Test_kits">
                    <div className="category-icon">
                        <img src="/media/headerImg/img5.png" alt="Test Kits" style={{ height: "47%", width: "47%" }} />
                    </div>
                    <p className="category-title">Test Kits</p>
                    <div className="hover-indicator"></div>
                </Link>
            </div>
        </div>
    );
}