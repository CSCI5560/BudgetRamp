
import React, { useState, useMemo, useEffect } from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { 
      BarChart, DollarSign, Shield, FileText, Users as UsersIcon, Menu, LogOut,
      Briefcase, Wallet, Clock, Users2, Bell, PlusCircle, User as UserIcon, Settings
    } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import {
      DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
      DropdownMenuSeparator, DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { useNotifications } from '@/contexts/NotificationContext';
    import { useData } from '@/contexts/DataContext';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
    //import { AddTransactionForm } from '@/components/AddTransactionForm';
    import AddTransactionForm from "@/components/AddTransactionForm";
    //import { AddUserForm } from '@/components/AddUserForm';
    import AddUserForm from "@/components/AddUserForm";
    import { formatCurrency } from '@/data/newData';

    const sidebarItems = [
      { icon: BarChart, label: 'Dashboard', path: '/dashboard', color: 'text-cyan-400' },
      { icon: DollarSign, label: 'Transactions', path: '/transactions', color: 'text-green-400' },
      { icon: UsersIcon, label: 'Users', path: '/users', color: 'text-yellow-400' },
      { icon: Shield, label: 'Fraud Alerts', path: '/fraud-alerts', color: 'text-red-400' },
      { icon: FileText, label: 'Reports', path: '/reports', color: 'text-indigo-400' },
    ];

    const HeaderStat = ({ icon: Icon, label, value }) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-700/50 rounded-full">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-bold text-foreground">{value}</p>
        </div>
      </div>
    );
    
    function Layout({ children }) {
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
      const [isAddUserOpen, setIsAddUserOpen] = useState(false);
      const [userAvatar, setUserAvatar] = useState(null);
      
      const { transactions, users, addTransaction, addUser } = useData();
      const location = useLocation();
      const { toast } = useToast();
      const { user, signOut } = useAuth();
      const navigate = useNavigate();
      const { notifications, clearNotifications } = useNotifications();

      const isUsersPage = location.pathname === '/users';

      useEffect(() => {
        try {
          const storedAvatar = localStorage.getItem('userAvatar');
          if (storedAvatar) {
            setUserAvatar(storedAvatar);
          } else {
            setUserAvatar(`https://avatar.vercel.sh/${user?.email}`);
          }
        } catch (e) {
          setUserAvatar(`https://avatar.vercel.sh/${user?.email}`);
        }
    
        const handleStorageChange = () => {
          try {
            const storedAvatar = localStorage.getItem('userAvatar');
            if (storedAvatar) {
              setUserAvatar(storedAvatar);
            }
          } catch (e) {
            console.error("Could not read avatar from storage", e);
          }
        };
    
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
      }, [user, location.pathname]);

      useEffect(() => {
        if (notifications.length > 0) {
          const latestNotif = notifications[0];
          toast({
            title: latestNotif.title,
            description: latestNotif.description,
            action: <Button variant="link" size="sm" onClick={() => navigate('/fraud-alerts')}>View</Button>,
          });
        }
      }, [notifications, toast, navigate]);

      const totalSpending = useMemo(() => transactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0), [transactions]);
      const totalAssets = useMemo(() => users.reduce((sum, u) => sum + u.yearly_income, 0), [users]);
      const fraudulentTransactions = useMemo(() => transactions.filter(t => t.fraud_label === 1), [transactions]);
      const totalFraudAmount = useMemo(() => fraudulentTransactions.reduce((sum, t) => sum + t.amount, 0), [fraudulentTransactions]);

      const uniqueClients = useMemo(() => {
        const clientIds = new Set(transactions.map(t => t.client_id));
        return Array.from(clientIds).map(id => ({
          id,
          name: `Client ${id.slice(-4)}`
        }));
      }, [transactions]);
    
      const handleLogout = async () => {
        await signOut();
        try {
          localStorage.removeItem('userAvatar');
        } catch (e) {
          console.error("Could not remove avatar from storage", e);
        }
        navigate('/login');
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
      };
    
      return (
        <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
    
          <motion.aside 
            className={`fixed left-0 top-0 h-full w-60 bg-secondary/30 border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 flex flex-col`}
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center p-4 border-b border-border h-16">
               <Link to="/" className="flex items-center gap-2">
                <img src="https://horizons-cdn.hostinger.com/8ed7485a-4b6a-443b-b3e6-74032987e468/logo-now-1-24g8h.png" alt="BudgetRamp Logo" className="h-8 w-auto" />
                <h1 className="text-xl font-bold text-foreground">
                  BudgetRamp
                </h1>
              </Link>
            </div>

            <nav className="mt-4 flex-grow px-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 my-1 rounded-full text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ${
                      isActive ? 'bg-accent text-foreground' : ''
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${item.color}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border mt-auto">
               <Button variant="outline" className="w-full justify-center rounded-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
          </motion.aside>
    
          <div className="flex-1 lg:ml-60 flex flex-col">
            <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-30 h-16 flex items-center">
              <div className="flex items-center justify-between px-6 w-full">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden mr-2 rounded-full"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                   <div className="hidden lg:flex items-center gap-6">
                      <HeaderStat icon={Wallet} label="Balance" value={formatCurrency(totalSpending)} />
                      <HeaderStat icon={Briefcase} label="Assets" value={formatCurrency(totalAssets)} />
                      <HeaderStat icon={Clock} label="Pending Fraud" value={formatCurrency(totalFraudAmount)} />
                      <HeaderStat icon={Users2} label="Total Users" value={users.length} />
                   </div>
                </div>
    
                <div className="flex items-center space-x-4">
                  {isUsersPage ? (
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <AddUserForm onAddUser={addUser} closeModal={() => setIsAddUserOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Transaction
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Transaction</DialogTitle>
                        </DialogHeader>
                        <AddTransactionForm onAddTransaction={addTransaction} clients={uniqueClients} closeModal={() => setIsAddTransactionOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="relative rounded-full">
                        <Bell className="h-5 w-5" />
                        {notifications.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 rounded-lg" align="end">
                      <div className="flex justify-between items-center p-2">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        {notifications.length > 0 && <Button variant="link" size="sm" onClick={clearNotifications}>Clear All</Button>}
                      </div>
                      <DropdownMenuSeparator />
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                        <DropdownMenuItem key={notif.id} className="flex gap-2 items-start cursor-pointer" onClick={() => navigate('/fraud-alerts')}>
                          <Shield className="h-5 w-5 text-red-500 mt-1"/>
                          <div>
                            <p className="font-semibold">{notif.title}</p>
                            <p className="text-xs text-muted-foreground">{notif.description}</p>
                          </div>
                        </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-cyan-400 transition-colors">
                          <AvatarImage src={userAvatar} />
                          <AvatarFallback>{user?.email?.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-lg">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
    
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      );
    }
    
    export default Layout;
