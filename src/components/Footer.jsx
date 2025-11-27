import React from 'react';
    import { Link } from 'react-router-dom';
    import { Github } from 'lucide-react';
    
    function Footer() {
      return (
        <footer className="bg-background border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <span className="font-semibold text-foreground tracking-wider uppercase">Product</span>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/dashboard" className="text-base text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                  <li><Link to="/reports" className="text-base text-muted-foreground hover:text-foreground">Reports</Link></li>
                  <li><Link to="/fraud-alerts" className="text-base text-muted-foreground hover:text-foreground">Security</Link></li>
                  <li><Link to="/transactions" className="text-base text-muted-foreground hover:text-foreground">Transactions</Link></li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-foreground tracking-wider uppercase">Company</span>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/about-us" className="text-base text-muted-foreground hover:text-foreground">About</Link></li>
                  <li><Link to="/contact-us" className="text-base text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                  <li><Link to="/faq" className="text-base text-muted-foreground hover:text-foreground">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-foreground tracking-wider uppercase">Resources</span>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/features" className="text-base text-muted-foreground hover:text-foreground">Features</Link></li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-foreground tracking-wider uppercase">Legal</span>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/privacy-policy" className="text-base text-muted-foreground hover:text-foreground">Privacy</Link></li>
                  <li><Link to="/terms-of-service" className="text-base text-muted-foreground hover:text-foreground">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/logo-now-1-24g8h.png" alt="BudgetRamp Logo" className="h-8 w-auto" />
                <span className="text-base font-bold text-foreground">BudgetRamp</span>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <a href="https://github.com/CSCI5560/BudgetRamp" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-6 w-6" />
                </a>
                <p className="text-base text-muted-foreground">&copy; 2025 BudgetRamp, Inc. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      );
    }
export default Footer;