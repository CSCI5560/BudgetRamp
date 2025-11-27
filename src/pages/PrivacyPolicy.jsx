import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Home, Info, UserPlus, LogIn, Star, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

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
      <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-50 text-foreground border-b border-border">
          <Link to="/" className="flex items-center gap-3">
             <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/logo-now-1-24g8h.png" alt="BudgetRamp Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold">BudgetRamp</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold"><Home className="h-4 w-4 text-cyan-400" />Home</Link>
            <Link to="/about-us" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Info className="h-4 w-4 text-green-400" />About Us</Link>
            <Link to="/features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Star className="h-4 w-4 text-yellow-400" />Features</Link>
            <Link to="/contact-us" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Phone className="h-4 w-4 text-red-400" />Contact Us</Link>
          </nav>
          {user ? <Button onClick={handleDashboardClick} className="bg-cyan-500 text-background hover:bg-cyan-600 border-cyan-500 rounded-full px-6">
                Go to Dashboard
              </Button> : <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')} className="flex items-center gap-2 rounded-full">
                    <LogIn className="h-4 w-4" />
                    Login
                </Button>
                <Button onClick={() => navigate('/login')} className="bg-cyan-500 text-background hover:bg-cyan-600 border-cyan-500 rounded-full flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                </Button>
            </div>}
        </header>
    );
  };

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
        <LandingPageHeader />
        <main className="flex-grow container mx-auto px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>BudgetRamp ("us", "we", or "our") operates the BudgetRamp website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
                    
                    <h2 className="text-2xl font-semibold text-foreground pt-4">1. Information Collection and Use</h2>
                    <p>We collect several different types of information for various purposes to provide and improve our Service to you. This includes login credentials (email), newsletter subscriptions, and any data you choose to upload for analysis. We do not share this data with third parties.</p>

                    <h2 className="text-2xl font-semibold text-foreground pt-4">2. Data Security</h2>
                    <p>The security of your data is important to us. We use strong encryption and follow industry best practices to protect your information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

                    <h2 className="text-2xl font-semibold text-foreground pt-4">3. Changes to This Privacy Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this PrivacyPolicy periodically for any changes.</p>
                </div>
            </motion.div>
        </main>
        <Footer />
    </div>
  );
};

export default PrivacyPolicy;