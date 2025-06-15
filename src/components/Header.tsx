
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface HeaderProps {
    onLogoClick: () => void;
}

const Header = ({ onLogoClick }: HeaderProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-dark backdrop-blur-sm border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
                <div 
                    className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform"
                    onClick={onLogoClick}
                >
                    <img src="/lovable-uploads/e937e8a7-7b24-4ba0-b98b-aade23ac4f11.png" alt="Karol Core Logo" className="h-12 w-12" />
                    <div>
                        <h1 className="text-2xl font-bold text-gradient-primary">Karol Core</h1>
                        <p className="text-slate-400 text-sm">AGI Orchestrator Lab</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-white font-medium">{t('status.active')}</p>
                        <p className="text-green-400 text-sm">{t('status.allSystemsOperational')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Header);
