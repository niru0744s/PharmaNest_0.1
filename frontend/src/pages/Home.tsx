import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    PlusCircle,
    ArrowRight,
    HeartPulse,
    BadgeCheck,
    Clock,
    ChevronRight,
    ShieldCheck,
    Truck,
    Star,
} from 'lucide-react';

import { productService } from '../services/productService';
import { Product } from '../types/product';
import ProductCard from '../components/product/ProductCard';

// Import category images
import img1 from '../assets/categories/img1.png';
import img2 from '../assets/categories/img2.png';
import img3 from '../assets/categories/img3.png';
import img4 from '../assets/categories/img4.png';
import img5 from '../assets/categories/img5.png';
import img6 from '../assets/categories/img6.png';
import img7 from '../assets/categories/img7.png';
import docImg from '../assets/categories/docImg.png';

const CATEGORIES = [
    { name: 'Medicine', image: img2, color: 'from-blue-500/10 to-blue-600/10', textColor: 'text-blue-600' },
    { name: 'OTC_Medicine', image: img1, color: 'from-emerald-500/10 to-emerald-600/10', textColor: 'text-emerald-600' },
    { name: 'First_Aid', image: img3, color: 'from-red-500/10 to-red-600/10', textColor: 'text-red-600' },
    { name: 'Hygiene', image: img4, color: 'from-purple-500/10 to-purple-600/10', textColor: 'text-purple-600' },
    { name: 'Baby_product', image: img7, color: 'from-orange-500/10 to-orange-600/10', textColor: 'text-orange-600' },
    { name: 'Supplements', image: img6, color: 'from-yellow-500/10 to-yellow-600/10', textColor: 'text-yellow-600' },
    { name: 'Test_kits', image: img5, color: 'from-cyan-500/10 to-cyan-600/10', textColor: 'text-cyan-600' },
];

const Home = () => {
    const navigate = useNavigate();
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getProducts({ limit: 8, sort: '-averageRating' });
                if (response.success) {
                    setTopProducts(response.products);
                }
            } catch (error) {
                console.error('Failed to fetch top products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="bg-white overflow-hidden">
            {/* Super Premium Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            x: [0, 50, 0],
                            y: [0, -50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, -45, 0],
                            x: [0, -30, 0],
                            y: [0, 60, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6">
                                <PlusCircle size={14} className="text-blue-600" />
                                Your Most Trusted Pharmacy
                            </div>
                            <h1 className="text-6xl sm:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
                                Genuine Health, <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
                                    Delivered with Care.
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                                Access certified medicines, healthcare essentials, and wellness products from the comfort of your home. Premium quality, verified sources.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="group relative px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl transition overflow-hidden shadow-2xl shadow-gray-200"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="relative flex items-center gap-2">
                                        Shop Medications <ArrowRight size={18} />
                                    </span>
                                </Link>
                                <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition transition-all flex items-center gap-2">
                                    <HeartPulse size={18} className="text-red-500" />
                                    Book Consultation
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-12 flex items-center gap-8 text-slate-400">
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-bold text-slate-800">50k+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Users</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-bold text-slate-800">10k+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified Products</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative lg:block hidden"
                        >
                            <div className="relative z-10 w-full rounded-3xl overflow-hidden shadow-2xl transform hover:rotate-2 transition-transform duration-700">
                                <img
                                    src="/images/doctor.png"
                                    alt="Health Professional"
                                    className="w-full object-cover aspect-[4/5]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                            </div>

                            {/* Floating UI Elements */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 glass-effect p-6 rounded-3xl shadow-2xl z-20 max-w-[200px]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <BadgeCheck size={18} />
                                    </div>
                                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">100% Genuine</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">All medications are verified by certified pharmacy boards.</p>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-1/2 -left-20 glass-effect p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Fastest Delivery</p>
                                    <p className="text-sm font-extrabold text-slate-800">Under 60 Mins</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Premium Categories Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
                        <h2 className="text-xs font-extrabold text-blue-600 uppercase tracking-[0.2em] mb-3">Health Solutions</h2>
                        <h3 className="text-4xl font-black text-slate-900">Explore by Category</h3>
                    </motion.div>
                    <Link to="/products" className="group flex items-center gap-2 text-sm font-extrabold text-slate-900 hover:text-blue-600 transition">
                        Full Catalog <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6"
                >
                    {CATEGORIES.map((cat) => (
                        <motion.div
                            key={cat.name}
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                            className="group relative h-48 rounded-[2.5rem] overflow-hidden cursor-pointer bg-slate-50 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500"
                            onClick={() => navigate(`/products?category=${cat.name}`)}
                        >
                            {/* Background Shape */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative h-full flex flex-col items-center justify-center p-6 z-10">
                                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                                    {/* Image with glow effect on hover */}
                                    <div className="absolute inset-0 bg-white rounded-full scale-75 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="text-[13px] font-black text-slate-800 text-center leading-tight">
                                    {cat.name.replace('_', ' ')}
                                </span>
                                <div className={`mt-2 h-1 w-0 group-hover:w-12 bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Top Products Shimmer/Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
                            <h2 className="text-xs font-extrabold text-blue-600 uppercase tracking-[0.2em] mb-3">Our Best Sellers</h2>
                            <h3 className="text-4xl font-black text-slate-900 mb-4">Highly Rated Healthcare</h3>
                            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-600 mx-auto rounded-full" />
                        </motion.div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="premium-card h-[400px] shimmer" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {topProducts.map(product => (
                                <motion.div key={product._id} variants={fadeInUp}>
                                    <ProductCard
                                        product={product}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Expert Consultation Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                        <img
                            src={docImg}
                            alt="Doctor Consultation"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
                    </div>

                    <div className="relative z-10 p-12 lg:p-24 lg:w-3/5">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-emerald-400 font-extrabold uppercase tracking-widest text-sm mb-4">Dedicated Support</h2>
                            <h3 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
                                Professional Medical Advice <br />
                                <span className="text-slate-400 font-bold">At Your Fingertips.</span>
                            </h3>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                                Connect with our panel of certified doctors and pharmacy experts. Get personalized guidance on dosages, side effects, and wellness tips.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-emerald-400 hover:text-white transition-all transform hover:scale-105">
                                    Start Free Consultation
                                </button>
                                <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all">
                                    How it Works
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Modern Pharmacy Experience */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-xs font-extrabold text-blue-600 uppercase tracking-[0.2em] mb-3">Pharmacy 2.0</h2>
                        <h3 className="text-4xl font-black text-slate-900 mb-6">Redefining Your <br />Pharmacy Experience</h3>
                        <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                            We combine cutting-edge technology with traditional pharmaceutical expertise to ensure you get the best out of your healthcare journey.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Digital Prescriptions", desc: "Upload and manage your prescriptions securely online." },
                                { title: "Refill Reminders", desc: "Never miss a dose with our automated refill tracking." },
                                { title: "Safety Shield", desc: "Multi-point verification for every medicine dispensed." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-1">
                                        <BadgeCheck size={14} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-3xl shadow-blue-500/10 border-8 border-slate-50">
                            <img
                                src="/images/mediCart.png"
                                alt="Modern Pharmacy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-lg shadow-blue-100/50">
                            <ShieldCheck size={36} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-lg mb-1">Authentic Products</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">100% verified medications and healthcare supplements.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-lg shadow-emerald-100/50">
                            <Truck size={36} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-lg mb-1">Express Delivery</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">Fast doorstep delivery in under 24 hours.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 shadow-lg shadow-orange-100/50">
                            <Star size={36} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-lg mb-1">Premium Support</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">Personalized consultation by certified healthcare experts.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
