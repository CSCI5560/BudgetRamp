
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, UserPlus, LogIn, Zap, LayoutDashboard, CreditCard, Shield, PieChart, FileText, Phone, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Footer from '@/components/Footer';
const LandingPageHeader = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
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
            <Link to="/" className="flex items-center gap-2 text-foreground font-semibold"><Home className="h-4 w-4 text-cyan-400" />Home</Link>
            <Link to="/about-us" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Users className="h-4 w-4 text-green-400" />About Us</Link>
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
        </header>;
};
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  link,
  delay,
  color
}) => {
  const navigate = useNavigate();
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} whileInView={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} viewport={{
    once: true
  }} onClick={() => navigate(link)} className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg cursor-pointer hover:bg-secondary/50 hover:-translate-y-1 transition-all group">
          <Icon className={`h-10 w-10 ${color} mb-4`} />
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
        </motion.div>;
};
function LandingPage() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const handleGetStartedClick = e => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  return <div className="bg-background text-foreground min-h-screen flex flex-col overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <LandingPageHeader />
          
            <main className="flex-grow flex items-center">
              <div className="container mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <motion.div className="text-center lg:text-left" initial={{
              opacity: 0,
              x: -50
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8
            }}>
                    <h1 className="text-5xl md:text-7xl font-semibold leading-tight text-foreground font-['Inter']">
                      Smart Finance, Secure Future.
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                      BudgetRamp makes it safe and incredibly easy for you to manage all of your transactions, monitor your personal spending, detect fraud, and generate insightful financial reports. Take control of your financial journey with our intuitive tools and real-time analytics. Join us to build a more secure and prosperous financial future today.
                    </p>
                    <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                      <Button size="lg" className="bg-cyan-500 text-background hover:bg-cyan-600 rounded-full px-8 py-6 text-lg" onClick={handleGetStartedClick}>
                        Get Started
                      </Button>
                      <Button size="lg" variant="outline" className="text-foreground border-white hover:bg-accent hover:text-accent-foreground rounded-full px-8 py-6 text-lg border-2" onClick={() => navigate('/features')}>
                        Learn More
                      </Button>
                    </div>
                  </motion.div>
                  
                  <motion.div initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="relative flex justify-center items-center">
                    <img alt="Financial analytics dashboard with charts and graphs on a laptop" className="w-full max-w-xl z-10" src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/nier33-GByr8.png" />
                  </motion.div>
                </div>
              </div>
            </main>
            
            <div className="border-b-2 border-border container mx-auto my-8"></div>

            <div className="container mx-auto px-6 py-16">
              <h2 className="text-3xl font-bold text-center mb-12">Main Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <FeatureCard icon={LayoutDashboard} title="Analytics Dashboard" description="Visualize your financial data with interactive charts and key performance indicators." link="/dashboard" delay={0} color="text-blue-400" />
                  <FeatureCard icon={CreditCard} title="Transaction Management" description="Search, filter, and review all your transactions in one clean interface." link="/transactions" delay={0.1} color="text-green-400" />
                  <FeatureCard icon={Users} title="User Directory" description="View detailed profiles for all users, including financial summaries and history." link="/users" delay={0.2} color="text-red-400" />
                  <FeatureCard icon={Shield} title="Fraud Alerts" description="Get real-time alerts for suspicious activities with our smart detection system." link="/fraud-alerts" delay={0.3} color="text-yellow-400" />
                  <FeatureCard icon={PieChart} title="Custom Reports" description="Generate and export detailed financial reports for comprehensive analysis." link="/reports" delay={0.4} color="text-blue-400" />
                  <FeatureCard icon={FileText} title="Data Export" description="Easily export your data to CSV or PDF for offline analysis." link="/reports" delay={0.5} color="text-green-400" />
              </div>
            </div>

            <Footer />
          </div>
        </div>;
}
export default LandingPage;
