import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const SecurityNotice = () => {
  return (
    <Card className="bg-slate-800/50 border-yellow-800/30">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Security Notice</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-green-500/10 border-green-500/30">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-400">
            <strong>Security Hardening Complete:</strong> Critical vulnerabilities have been addressed including hardcoded credentials removal, XSS prevention, and database security improvements.
          </AlertDescription>
        </Alert>

        <Alert className="bg-yellow-500/10 border-yellow-500/30">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400">
            <strong>Admin Setup Disabled:</strong> Default account creation has been disabled for security. Please contact your administrator to set up proper authentication.
          </AlertDescription>
        </Alert>

        <Alert className="bg-blue-500/10 border-blue-500/30">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-400">
            <strong>Enhanced Protection:</strong> All system tables now require admin privileges, input validation is active, and secure communication protocols are enforced.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Fixed Issues
            </h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Hardcoded credentials removed</li>
              <li>• XSS vulnerability patched</li>
              <li>• Service role key secured</li>
              <li>• RLS policies tightened</li>
              <li>• Input validation added</li>
              <li>• Content length limits enforced</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security Features
            </h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Admin-only system access</li>
              <li>• Request size validation</li>
              <li>• URL format validation</li>
              <li>• Secure demo sessions</li>
              <li>• Error handling improved</li>
              <li>• Audit logging enabled</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityNotice;