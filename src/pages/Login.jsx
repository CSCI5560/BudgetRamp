import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (!error) {
        toast({
          title: 'Login Successful',
          description: "Welcome back!",
        });
        navigate('/dashboard');
      }
    } else {
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: "Passwords do not match.",
        });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (!error) {
        toast({
          title: 'Signup Successful',
          description: 'Please check your email to confirm your account.',
        });
        setIsLogin(true); // Switch to login view after successful signup
      }
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link to="/" className="inline-block">
             <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/logo-now-1-24g8h.png" alt="BudgetRamp Logo" className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold mt-4 text-foreground">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to access your dashboard.' : 'Join us to manage your finances better.'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            )}
            <Button type="submit" className="w-full bg-cyan-500 text-background hover:bg-cyan-600" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </Button>
        </motion.p>
         <motion.p variants={itemVariants} className="mt-4 text-center text-xs text-muted-foreground">
             <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link> &bull; <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
         </motion.p>
      </motion.div>
    </div>
  );
}

export default Login;