
import { useState } from 'react';

export const useModals = () => {
    const [showTrainingCallModal, setShowTrainingCallModal] = useState(false);
    const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
    
    return {
        showTrainingCallModal,
        setShowTrainingCallModal,
        showAnalyticsDashboard,
        setShowAnalyticsDashboard,
    };
};
