
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSimplifiedAuth } from '@/hooks/useSimplifiedAuth';
import { User, Settings, Crown } from 'lucide-react';

const UserProfile = () => {
  const { user, profile, updateProfile } = useSimplifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = profile?.first_name || user?.email?.charAt(0) || '';
    const lastName = profile?.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'moderator': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-cyan-600 text-white text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-cyan-400 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User Profile (Demo Mode)</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                {user?.email}
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getRoleColor(profile?.role || 'user')}>
                  {profile?.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                  {profile?.role || 'user'}
                </Badge>
                <Badge variant="outline" className="text-slate-400">
                  Demo Mode Active
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="border-blue-500/50 text-blue-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-slate-200">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="bg-slate-900/50 border-slate-700/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-slate-200">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="bg-slate-900/50 border-slate-700/50 text-white"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Save Changes (Demo)
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400">First Name</Label>
                <p className="text-white font-medium">{profile?.first_name || 'Demo'}</p>
              </div>
              <div>
                <Label className="text-slate-400">Last Name</Label>
                <p className="text-white font-medium">{profile?.last_name || 'User'}</p>
              </div>
            </div>
            <div>
              <Label className="text-slate-400">Email</Label>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-slate-400">User ID</Label>
              <p className="text-slate-400 text-sm font-mono">{user?.id}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
              <p className="text-blue-300 text-sm">
                Platform running in demo mode - authentication disabled for development.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
