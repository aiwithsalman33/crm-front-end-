import React from 'react';
import StatsCard from './StatsCard';
import { TrendingUp, Flame, CheckSquare, DollarSign } from 'lucide-react';
import { useDeals } from '../../../contexts/DealsContext';
import { useLeads } from '../../../contexts/LeadsContext';
import { useTasks } from '../../../contexts/TasksContext';
import { Target } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const { deals } = useDeals();
  const { leads } = useLeads();
  const { tasks } = useTasks();

  const dealsInPipeline = deals.filter(d => d.stage !== 'Closed - Won' && d.stage !== 'Closed - Lost').length;
  const hotLeads = leads.filter(l => l.score > 80).length;
  const activeTasks = tasks.filter(t => t.status !== 'Completed').length;
  const totalRevenue = deals.filter(d => d.stage === 'Closed - Won').reduce((sum, d) => sum + d.value, 0);

  const wonDeals = deals.filter(d => d.stage === 'Closed - Won').length;
  const closedDeals = deals.filter(d => d.stage === 'Closed - Won' || d.stage === 'Closed - Lost').length;
  const winRate = closedDeals > 0 ? ((wonDeals / closedDeals) * 100).toFixed(0) : '0';

  const stats = [
    { title: 'Deals in Pipeline', value: dealsInPipeline.toString(), icon: TrendingUp },
    { title: 'Hot Leads', value: hotLeads.toString(), icon: Flame },
    { title: 'Active Tasks', value: activeTasks.toString(), icon: CheckSquare },
    { title: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign },
    { title: 'Win Rate', value: `${winRate}%`, icon: Target },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          index={index}
        />
      ))}
    </div>
  );
};

export default DashboardStats;