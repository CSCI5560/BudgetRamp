
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Users from '@/pages/Users';
import UserProfile from '@/pages/UserProfile';
import FraudAlerts from '@/pages/FraudAlerts';
import Reports from '@/pages/Reports';
import Login from '@/pages/Login';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Settings from '@/pages/Settings';
import SearchResults from '@/pages/SearchResults';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DataProvider } from '@/contexts/DataContext';
import LandingPage from '@/pages/LandingPage';
import Features from '@/pages/Features';
import AboutUs from '@/pages/AboutUs';
import ContactUs from '@/pages/ContactUs';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import FAQ from '@/pages/FAQ';
import MLInsights from "@/pages/MLInsights";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-background"><div>Loading...</div></div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

const AppLayout = ({ children }) => {
  return <Layout>{children}</Layout>
}

function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-background"><div>Loading...</div></div>;
  }

  const InAppRoutes = () => (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/fraud-alerts" element={<FraudAlerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </AppLayout>
  );

  return (
    <ThemeProvider>
      <NotificationProvider>
        <DataProvider>
          <Helmet>
            <title>BudgetRamp - Advanced Financial Analytics Dashboard</title>
            <meta name="description" content="Comprehensive financial transaction management and fraud detection platform with advanced analytics and reporting capabilities." />
            <meta property="og:title" content="BudgetRamp - Advanced Financial Analytics Dashboard" />
            <meta property="og:description" content="Comprehensive financial transaction management and fraud detection platform with advanced analytics and reporting capabilities." />
          </Helmet>
          <Router>
            <Routes>
              <Route path="/ml-insights" element={<MLInsights />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <PrivateRoute>
                  <InAppRoutes />
                </PrivateRoute>
              } />
            </Routes>
            <Toaster />
          </Router>
        </DataProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
