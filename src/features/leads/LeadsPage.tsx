import React, { useState, useMemo } from 'react';
import { Plus, Search, List, LayoutGrid } from 'lucide-react';
import Button from '../../components/shared/ui/Button';
import LeadsTable from './components/LeadsTable';
import LeadsPipelineView, { NewLeadProvider } from './components/LeadsPipelineView';
import EditLeadModal from './components/EditLeadModal';
import CreateLeadModal from './components/CreateLeadModal';
import { useLeads } from '../../contexts/LeadsContext';
import { useUI } from '../../contexts/UIContext';
import { Lead, LeadStatus } from '../../types';

const LeadsPage: React.FC = () => {
  const { leads } = useLeads();
  const { isEditLeadModalOpen, isCreateLeadModalOpen, openCreateLeadModal } = useUI();
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLeadStatus, setNewLeadStatus] = useState<LeadStatus | null>(null);

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const lowercasedQuery = searchQuery.toLowerCase();
    return leads.filter(lead =>
      lead.firstName.toLowerCase().includes(lowercasedQuery) ||
      lead.lastName.toLowerCase().includes(lowercasedQuery) ||
      lead.company.toLowerCase().includes(lowercasedQuery) ||
      lead.email.toLowerCase().includes(lowercasedQuery)
    );
  }, [leads, searchQuery]);

  const sortedLeads = useMemo(() => {
    let sortableLeads = [...filteredLeads];
    if (sortConfig !== null) {
      sortableLeads.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLeads;
  }, [filteredLeads, sortConfig]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to handle lead selection for editing
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const newLeadContextValue = {
    newLeadStatus,
    setNewLeadStatus
  };

  return (
    <div className="space-y-6 flex flex-col h-full animate-fadeIn">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView('pipeline')}
                className={`p-1.5 rounded-md transition-all ${view === 'pipeline' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                title="Kanban View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('table')}
                className={`p-1.5 rounded-md transition-all ${view === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={openCreateLeadModal}
              className="bg-primary hover:bg-primary-dark text-white shadow-sm"
            >
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'pipeline' ? (
          <NewLeadProvider value={newLeadContextValue}>
            <LeadsPipelineView leads={filteredLeads} onSelectLead={handleSelectLead} />
          </NewLeadProvider>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm h-full overflow-y-auto border border-gray-200">
            <LeadsTable leads={sortedLeads} requestSort={requestSort} sortConfig={sortConfig} />
          </div>
        )}
      </div>
      {isEditLeadModalOpen && <EditLeadModal lead={selectedLead} />}
      {isCreateLeadModalOpen && <CreateLeadModal defaultStatus={newLeadStatus || undefined} />}
    </div>
  );
};

export default LeadsPage;