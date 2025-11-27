import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Home, Info, Shield, UserPlus, LogIn, BarChart2, CreditCard, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';

const LandingPageHeader = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleDashboardClick = (e) => {
        e.preventDefault();
        if (user) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
    };

    return (
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-[#1C1C1E]/80 backdrop-blur-sm z-50 text-white">
        <Link to="/" className="flex items-center gap-3">
          <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/ffaca4605e19431f4a311e93bc3b98d9.png" alt="BudgetRamp Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">BudgetRamp</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><Home className="h-4 w-4" />Home</Link>
            <Link to="/about-us" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"><Info className="h-4 w-4" />About Us</Link>
            <Link to="/services" className="flex items-center gap-2 text-white font-semibold"><Shield className="h-4 w-4" />Services</Link>
        </nav>
        {user ? (
             <Button onClick={handleDashboardClick} className="bg-blue-500 hover:bg-blue-600 rounded-full px-6">
                Go to Dashboard
             </Button>
        ) : (
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/login')} className="flex items-center gap-2 text-white">
                    <LogIn className="h-4 w-4" />
                    Login
                </Button>
                <Button onClick={() => navigate('/login')} className="bg-blue-500 hover:bg-blue-600 rounded-full flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                </Button>
            </div>
        )}
      </header>
    );
};

const ServiceCard = ({ icon: Icon, title, description, color }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-lg transform hover:-translate-y-2 transition-transform duration-300">
            <Icon className={`h-12 w-12 mb-4 ${color}`} />
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
};

const Services = () => {
  return (
    <div className="bg-[#1C1C1E] text-white min-h-screen flex flex-col">
        <LandingPageHeader />
        <main className="flex-grow container mx-auto px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Our Services</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center leading-relaxed mb-12">
                    We provide a comprehensive suite of tools to give you full control over your financial data.
                </p>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <ServiceCard 
                        icon={CreditCard}
                        title="Transaction Monitoring"
                        description="Keep a close eye on all your transactions with our real-time monitoring and advanced filtering capabilities. Never lose track of your spending."
                        color="text-blue-400"
                    />
                     <ServiceCard 
                        icon={AlertTriangle}
                        title="Fraud Detection"
                        description="Our AI-powered system analyzes patterns to detect and alert you of suspicious activities, protecting your finances from potential threats."
                        color="text-red-400"
                    />
                     <ServiceCard 
                        icon={BarChart2}
                        title="Financial Reporting"
                        description="Generate detailed and insightful reports on your spending habits, cash flow, and more. Make data-driven decisions for your financial future."
                        color="text-green-400"
                    />
                </div>
            </motion.div>
        </main>
        <Footer />
    </div>
  );
};

export default Services;