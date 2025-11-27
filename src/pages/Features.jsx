
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Home, Users, Zap, UserPlus, LogIn, LayoutDashboard, CreditCard, Shield, PieChart, FileText, Phone, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
const LandingPageHeader = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleDashboardClick = e => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  return <header className="py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-50 text-foreground border-b border-border">
          <Link to="/" className="flex items-center gap-3">
             <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/logo-now-1-24g8h.png" alt="BudgetRamp Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold">BudgetRamp</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold"><Home className="h-4 w-4 text-cyan-400" />Home</Link>
            <Link to="/about-us" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Users className="h-4 w-4 text-green-400" />About Us</Link>
            <Link to="/features" className="flex items-center gap-2 text-foreground transition-colors"><Zap className="h-4 w-4 text-yellow-400" />Features</Link>
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
        </header>;
};
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
  delay
}) => {
  return <motion.div className="bg-secondary/30 backdrop-blur-sm p-8 rounded-lg transform hover:-translate-y-2 transition-transform duration-300" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }}>
            <Icon className={`h-12 w-12 mb-4 ${color}`} />
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>;
};
const Features = () => {
  const featuresList = [{
    icon: LayoutDashboard,
    title: "Analytics Dashboard",
    description: "Visualize your financial data with interactive charts and key performance indicators.",
    color: "text-blue-400",
    delay: 0
  }, {
    icon: CreditCard,
    title: "Transaction Management",
    description: "Search, filter, and review all your transactions in one clean interface.",
    color: "text-green-400",
    delay: 0.1
  }, {
    icon: Users,
    title: "User Directory",
    description: "View detailed profiles for all users, including financial summaries and history.",
    color: "text-yellow-400",
    delay: 0.2
  }, {
    icon: Shield,
    title: "Fraud Alerts",
    description: "Get real-time alerts for suspicious activities with our smart detection system.",
    color: "text-red-400",
    delay: 0.3
  }, {
    icon: PieChart,
    title: "Custom Reports",
    description: "Generate and export detailed financial reports for comprehensive analysis.",
    color: "text-indigo-400",
    delay: 0.4
  }, {
    icon: FileText,
    title: "Data Export",
    description: "Easily export your financial data and reports to CSV or PDF for offline analysis or record-keeping.",
    color: "text-purple-400",
    delay: 0.5
  }];
  return <div className="bg-background text-foreground min-h-screen flex flex-col">
        <LandingPageHeader />
        <main className="flex-grow container mx-auto px-6 py-16">
            <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }}>
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Main Features</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed mb-12">
                    Discover the powerful tools that make BudgetRamp the ultimate financial analytics dashboard.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {featuresList.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} color={feature.color} delay={feature.delay} />)}
                </div>
            </motion.div>
        </main>
        <Footer />
    </div>;
};
export default Features;
