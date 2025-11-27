import React, { useState, useRef, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { useToast } from '@/components/ui/use-toast';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { User, Bell, Lock, Upload } from 'lucide-react';
    import { useNotifications } from '@/contexts/NotificationContext';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    
    function Settings() {
      const { toast } = useToast();
      const { settings, updateSettings } = useNotifications();
      const { user } = useAuth();

      const [profile, setProfile] = useState({ name: user?.user_metadata?.full_name || '', email: user?.email || '' });
      const [avatarPreview, setAvatarPreview] = useState(null);
      const fileInputRef = useRef(null);
      
      useEffect(() => {
        try {
            const storedAvatar = localStorage.getItem('userAvatar');
            if (storedAvatar) {
                setAvatarPreview(storedAvatar);
            } else {
                 setAvatarPreview(`https://avatar.vercel.sh/${user?.email}`);
            }
        } catch (error) {
            console.error("Failed to read avatar from localStorage", error);
            setAvatarPreview(`https://avatar.vercel.sh/${user?.email}`);
        }
      }, [user]);
    
      const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
      };
    
      const handleNotificationsChange = (name) => {
        updateSettings({ [name]: !settings[name] });
      };
    
      const handleSaveChanges = () => {
        try {
          if (avatarPreview && !avatarPreview.startsWith('https')) {
            localStorage.setItem('userAvatar', avatarPreview);
            window.dispatchEvent(new Event('storage'));
          }
        } catch (error) {
          console.error("Failed to save avatar to localStorage", error);
          toast({
            title: "Error Saving Avatar",
            description: "Could not save your new profile picture.",
            variant: "destructive"
          });
        }
        
        toast({
          title: "Settings Saved!",
          description: "Your new settings have been successfully applied.",
        });
      };
    
      const handleChangePassword = () => {
        toast({
          title: "🚧 Feature Not Implemented",
          description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
      };
      
      const handleAvatarClick = () => {
        fileInputRef.current.click();
      };
    
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setAvatarPreview(reader.result);
              try {
                localStorage.setItem('userAvatar', reader.result);
                window.dispatchEvent(new Event('storage'));
                toast({
                  title: "Profile Picture Updated!",
                  description: "Your new picture has been applied instantly.",
                });
              } catch (error) {
                console.error("Failed to save avatar to localStorage", error);
                toast({
                  title: "Error Saving Avatar",
                  description: "Could not save your new profile picture.",
                  variant: "destructive"
                });
              }
          };
          reader.readAsDataURL(file);
        }
      };
    
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-blue-500" />Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 cursor-pointer group" onClick={handleAvatarClick}>
                            <AvatarImage src={avatarPreview} />
                            <AvatarFallback>{profile.name.substring(0,1) || user?.email.substring(0,1).toUpperCase()}</AvatarFallback>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </Avatar>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg"
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} className="max-w-xs" placeholder="Your Name"/>
                    </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} placeholder="your.email@example.com"/>
                </div>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-yellow-500" />Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fraud-alerts">Fraud Alerts</Label>
                <Switch id="fraud-alerts" checked={settings.fraud} onCheckedChange={() => handleNotificationsChange('fraud')} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="summary-emails">Weekly Summary Emails</Label>
                <Switch id="summary-emails" checked={settings.summary} onCheckedChange={() => handleNotificationsChange('summary')} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="news-updates">News & Updates</Label>
                <Switch id="news-updates" checked={settings.news} onCheckedChange={() => handleNotificationsChange('news')} />
              </div>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-red-500" />Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="rounded-full" onClick={handleChangePassword}>Change Password</Button>
            </CardContent>
          </Card>
    
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} className="rounded-full">Save Changes</Button>
          </div>
        </motion.div>
      );
    }
    
    export default Settings;