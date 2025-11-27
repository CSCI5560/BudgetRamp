
import React from 'react';
    import { motion } from 'framer-motion';
    import { Link, useNavigate } from 'react-router-dom';
    import Footer from '@/components/Footer';
    import { Home, Users, UserPlus, LogIn, Zap, Phone, HelpCircle } from 'lucide-react';
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
          <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-50 text-foreground border-b border-border">
          <Link to="/" className="flex items-center gap-3">
             <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/logo-now-1-24g8h.png" alt="BudgetRamp Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold">BudgetRamp</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold"><Home className="h-4 w-4 text-cyan-400" />Home</Link>
            <Link to="/about-us" className="flex items-center gap-2 text-foreground transition-colors"><Users className="h-4 w-4 text-green-400" />About Us</Link>
            <Link to="/features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Zap className="h-4 w-4 text-yellow-400" />Features</Link>
            <Link to="/faq" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><HelpCircle className="h-4 w-4 text-indigo-400" />FAQ</Link>
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
    
    const AboutUs = () => {
      return (
        <div className="bg-background text-foreground min-h-screen flex flex-col">
            <LandingPageHeader />
            <main className="flex-grow container mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-foreground">About BudgetRamp</h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed mb-12">
                        Simplifying your financial world with powerful, intuitive tools.
                    </p>
    
                    <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto mb-16">
                        <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
                            <p className="text-muted-foreground">To empower individuals and businesses with financial clarity and control through secure, insightful technology.</p>
                        </div>
                        <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
                            <p className="text-muted-foreground">A world where financial management is accessible, stress-free, and a driver for growth and security for everyone.</p>
                        </div>
                        <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">Our Team</h2>
                            <p className="text-muted-foreground">A passionate group of finance experts and tech innovators dedicated to building the future of financial analytics.</p>
                        </div>
                    </div>
    
                    <div className="max-w-4xl mx-auto text-lg">
                         <p className="text-muted-foreground leading-relaxed mb-6">
                            Founded in 2025, BudgetRamp was born from a simple idea: financial tools should be powerful, not complicated. We saw a gap between the complex data financial institutions hold and the practical insights people need. Our journey began with a commitment to bridge that gap.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Today, BudgetRamp stands as a testament to that commitment. Our platform provides state-of-the-art tools for transaction monitoring, fraud detection, and financial reporting, all wrapped in a user-friendly interface. We are dedicated to continuous improvement, ensuring that BudgetRamp not only meets but exceeds the expectations of our users in a constantly evolving digital world.
                        </p>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
      );
    };
    
    export default AboutUs;
