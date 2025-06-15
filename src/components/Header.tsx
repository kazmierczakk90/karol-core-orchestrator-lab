
import { Brain } from 'lucide-react';
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
                    <Brain className="h-8 w-8 text-cyan-400 animate-pulse-glow" />
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

export default Header;
