import React from 'react';
    import { motion } from 'framer-motion';
    import { Link, useNavigate } from 'react-router-dom';
    import Footer from '@/components/Footer';
    import { Home, Info, Briefcase, UserPlus, LogIn } from 'lucide-react';
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
                <Link to="/financial-management" className="flex items-center gap-2 text-white font-semibold"><Briefcase className="h-4 w-4" />Financial Management</Link>
            </nav>
            {user ? (
                <Button onClick={handleDashboardClick} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                    Go to Dashboard
                </Button>
            ) : (
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')} className="flex items-center gap-2 text-white">
                        <LogIn className="h-4 w-4" />
                        Login
                    </Button>
                    <Button onClick={() => navigate('/login')} style={{ backgroundColor: '#287150' }} className="hover:opacity-90 rounded-full flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Sign Up
                    </Button>
                </div>
            )}
          </header>
        );
      };
    
    const FinancialManagement = () => {
      return (
        <div className="bg-[#1C1C1E] text-white min-h-screen flex flex-col">
            <LandingPageHeader />
            <main className="flex-grow container mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Smarter Financial Management</h1>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center leading-relaxed mb-12">
                        Achieve your financial goals with powerful insights and proven strategies.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-gray-800 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Create a Solid Budget</h2>
                            <p className="text-gray-400">The foundation of financial health is a solid budget. Use BudgetRamp's reporting tools to track your spending, identify savings opportunities, and allocate funds effectively.</p>
                        </div>
                         <div className="bg-gray-800 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Build an Emergency Fund</h2>
                            <p className="text-gray-400">Protect yourself from unexpected financial shocks. Aim to save at least 3-6 months' worth of living expenses in an easily accessible account.</p>
                        </div>
                         <div className="bg-gray-800 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Invest for the Future</h2>
                            <p className="text-gray-400">Make your money work for you. Understanding your spending habits helps you identify extra cash flow that can be channeled into long-term investments for growth.</p>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
      );
    };
    
    export default FinancialManagement;