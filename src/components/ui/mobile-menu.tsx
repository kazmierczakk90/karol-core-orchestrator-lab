
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MobileMenuProps {
  children: React.ReactNode;
  triggerClassName?: string;
}

export const MobileMenu = ({ children, triggerClassName = '' }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`md:hidden ${triggerClassName}`}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-slate-900 border-slate-700">
        <div className="mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
