
import React from 'react';
import SalesOverview from './components/SalesOverview';
import MyTasks from './components/MyTasks';
import DealPipeline from './components/DealPipeline';
import LeadConversion from './components/LeadConversion';
import DashboardStats from './components/DashboardStats';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Dashboard</h1>
          <p className="text-text-light mt-1 font-medium">Snapshot of your business performance.</p>
        </div>
      </div>

      <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
          <SalesOverview />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
          <MyTasks />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '400ms' }}>
          <DealPipeline />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '500ms' }}>
          <LeadConversion />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;