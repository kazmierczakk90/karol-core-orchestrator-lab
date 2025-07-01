
import React from 'react';
import AdvancedModulesManager from '@/components/advanced-modules/AdvancedModulesManager';

const AdvancedModulesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Modules</h1>
          <p className="text-slate-400">
            Manage and monitor advanced Karol-Core AGI modules with safety protocols
          </p>
        </div>
        <AdvancedModulesManager />
      </div>
    </div>
  );
};

export default AdvancedModulesPage;
