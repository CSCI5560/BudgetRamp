
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, UserPlus, LogIn, Zap, Users, Home, HelpCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
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
            <Link to="/faq" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><HelpCircle className="h-4 w-4 text-indigo-400" />FAQ</Link>
            <Link to="/contact-us" className="flex items-center gap-2 text-foreground transition-colors"><Phone className="h-4 w-4 text-red-400" />Contact Us</Link>
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

const ContactUs = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you shortly.",
      });
    e.target.reset();
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
        <LandingPageHeader />
        <main className="flex-grow container mx-auto px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Get in Touch</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed mb-12">
                    We'd love to hear from you. Whether you have a question, feedback, or need support, our team is here to help.
                </p>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <div className="bg-secondary/30 backdrop-blur-sm p-8 rounded-lg">
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Mail className="h-6 w-6 text-cyan-400"/>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <a href="mailto:support@budgetramp.com" className="text-cyan-300 hover:underline">support@budgetramp.com</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="h-6 w-6 text-cyan-400"/>
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <MapPin className="h-6 w-6 text-cyan-400"/>
                                <div>
                                    <h3 className="font-semibold">Office</h3>
                                    <p className="text-muted-foreground">1301 East Main Street, Murfreesboro, TN 37132</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                            <Input id="name" type="text" placeholder="Your Name" required className="bg-secondary/30 border-border text-foreground mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                            <Input id="email" type="email" placeholder="your.email@example.com" required className="bg-secondary/30 border-border text-foreground mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="message" className="text-muted-foreground">Message</Label>
                            <Textarea id="message" placeholder="How can we help you?" required className="bg-secondary/30 border-border text-foreground mt-2" rows={5} />
                        </div>
                        <Button type="submit" size="lg" className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </motion.div>
        </main>
        <Footer />
    </div>
  );
};

export default ContactUs;
