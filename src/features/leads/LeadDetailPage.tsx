import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, MoreVertical, Star, Mail, Phone, Calendar } from 'lucide-react';
import LeadInfoCard from './components/LeadInfoCard';
import LeadTimeline from './components/LeadTimeline';
import EditLeadModal from './components/EditLeadModal';
import Button from '../../components/shared/ui/Button';
import { useLeads } from '../../contexts/LeadsContext';
import { useTimeline } from '../../contexts/TimelineContext';
import { useUI } from '../../contexts/UIContext';
import { Lead } from '../../types';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { leads } = useLeads();
  const { notes, activities } = useTimeline();
  const { isEditLeadModalOpen, openEditLeadModal } = useUI();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const lead = leads.find(l => l.id === id);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Lead not found</h2>
        <p className="text-gray-500 mt-2">The lead you are looking for does not exist or has been removed.</p>
        <Link to="/leads">
          <Button variant="primary" size="md" className="mt-4 bg-[#0079C1] text-white">
            Back to Leads
          </Button>
        </Link>
      </div>
    );
  }

  const leadNotes = notes.filter(n => n.leadId === id);
  const leadActivities = activities.filter(a => a.leadId === id);

  const handleEditClick = () => {
    setSelectedLead(lead);
    openEditLeadModal();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <Link to="/leads" className="inline-flex items-center text-sm text-gray-500 hover:text-[#0079C1] mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Leads
        </Link>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {lead.firstName} {lead.lastName}
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Star className="w-5 h-5" />
                </button>
              </h1>
              <p className="text-gray-500 font-medium">{lead.company}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {lead.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {lead.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              icon={Edit}
              onClick={handleEditClick}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Button>
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <MoreVertical className="w-5 h-5" />
              </button>
              {/* Dropdown would go here */}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <LeadInfoCard lead={lead} />
          {/* Potential for another card here, e.g. Deals associated */}
        </div>
        <div className="lg:col-span-2">
          <LeadTimeline lead={lead} notes={leadNotes} activities={leadActivities} />
        </div>
      </div>
      {isEditLeadModalOpen && <EditLeadModal lead={selectedLead || lead} />}
    </div>
  );
};

export default LeadDetailPage;