
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Home, Users, UserPlus, LogIn, Zap, Phone, HelpCircle } from 'lucide-react';
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
            <Link to="/about-us" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Users className="h-4 w-4 text-green-400" />About Us</Link>
            <Link to="/features" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><Zap className="h-4 w-4 text-yellow-400" />Features</Link>
            <Link to="/faq" className="flex items-center gap-2 text-foreground transition-colors"><HelpCircle className="h-4 w-4 text-indigo-400" />FAQ</Link>
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
  
const faqs = [
    {
        question: "What is BudgetRamp?",
        answer: "BudgetRamp is an advanced financial analytics dashboard designed to help you manage transactions, monitor spending, detect potential fraud, and generate insightful financial reports."
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely. We use industry-leading encryption and security protocols to ensure your data is always protected. Security is our top priority."
    },
    {
        question: "How does the fraud detection work?",
        answer: "Our system uses advanced algorithms and machine learning to analyze transaction patterns. It flags suspicious activities in real-time based on various factors, such as unusual locations, amounts, or frequencies."
    },
    {
        question: "Can I connect my bank accounts?",
        answer: "Currently, BudgetRamp uses imported datasets for analysis. We are working on direct bank integration for a future update to provide an even more seamless experience."
    },
    {
        question: "What kind of reports can I generate?",
        answer: "You can generate several types of reports, including spending by category, monthly spending trends, and a full transaction history. These reports can be exported as CSV or PDF for your convenience."
    },
];

const FAQ = () => {
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
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Frequently Asked Questions</h1>
                <p className="text-lg text-muted-foreground text-center leading-relaxed mb-12">
                    Find answers to common questions about BudgetRamp.
                </p>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-secondary/30 backdrop-blur-sm rounded-lg mb-4 px-6 border-b-0">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </motion.div>
        </main>
        <Footer />
    </div>
  );
};

export default FAQ;
