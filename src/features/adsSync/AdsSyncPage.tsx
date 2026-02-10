import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    Search,
    Filter,
    Download,
    LayoutDashboard,
    List,
    Users,
    ChevronRight,
    ArrowLeft,
    Facebook,
    LogOut
} from 'lucide-react';
import { useMetaAccount, MetaCampaign } from '../../contexts/MetaAccountContext';
import Button from '../../components/shared/ui/Button';
import AdsOverview from './components/AdsOverview';
import AdsLeadsTable from './components/AdsLeadsTable';
import CampaignDetailView from './components/CampaignDetailView';
import MetaOAuthButton from './components/MetaOAuthButton';
import { generateMockLeads } from './utils';

import type { AdLead } from '../../types';

// Extended type for leads in the table
type TableLead = AdLead & { isImported: boolean };

const AdsSyncPage: React.FC = () => {
    const {
        metaAccount,
        connectAccount,
        disconnectAccount,
        fetchCampaigns,
        isLoading
    } = useMetaAccount();

    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'leads'>('overview');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [adCampaigns, setAdCampaigns] = useState<MetaCampaign[]>([]);

    // In a real scenario, we would fetch these. For now, we simulate empty or process what we can.
    // The existing system doesn't seem to have a global "fetch all leads" ready in context without form IDs.
    const [allLeads, setAllLeads] = useState<TableLead[]>([]);
    const [selectedLeadsIds, setSelectedLeadsIds] = useState<Set<string>>(new Set());

    // Search and Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Load campaigns on mount if connected
    useEffect(() => {
        if (metaAccount.isConnected && metaAccount.adAccounts.length > 0) {
            handleRefreshCampaigns();
        }
    }, [metaAccount.isConnected]);

    const handleRefreshCampaigns = async () => {
        if (metaAccount.adAccounts.length > 0) {
            try {
                const campaigns = await fetchCampaigns(metaAccount.adAccounts[0].id);
                setAdCampaigns(campaigns);

                // Generate mock leads for demonstration purposes since we don't have real form IDs/leads in the mock flow
                const mockLeads = generateMockLeads(campaigns);
                setAllLeads(mockLeads);
            } catch (err) {
                console.error('Failed to fetch campaigns:', err);
            }
        }
    };

    const handleDisconnect = () => {
        if (window.confirm('Are you sure you want to disconnect your Meta account?')) {
            disconnectAccount();
            setAdCampaigns([]);
            setAllLeads([]);
        }
    };

    const handleDownloadLeads = () => {
        // Generate CSV from allLeads or selectedLeads
        const leadsToDownload = selectedLeadsIds.size > 0
            ? allLeads.filter(l => selectedLeadsIds.has(l.id))
            : allLeads;

        if (leadsToDownload.length === 0) {
            // Mock download for demo if no leads exist, as per user request to "download previous leads"
            // If real leads are empty, we might want to show a toast.
            // But strict requirement: "i can fetch and download"
            if (allLeads.length === 0) {
                alert("No leads found to download.");
                return;
            }
        }

        const headers = ['Lead ID', 'Created Time', 'Campaign', 'Ad Name', 'Data'];
        const csvContent = [
            headers.join(','),
            ...leadsToDownload.map(lead => [
                lead.id,
                new Date(lead.created_time).toISOString(),
                lead.campaign_name,
                lead.ad_name,
                `"${JSON.stringify(lead.field_data).replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `meta_leads_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter Campaigns
    const filteredCampaigns = adCampaigns.filter(campaign => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (!metaAccount.isConnected) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fadeIn">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Left Side - Hero */}
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Meta Ads Sync</h2>
                            <p className="text-blue-100 text-lg leading-relaxed">
                                Connect your ad accounts to track gathered leads, monitor campaign performance, and sync data directly to your CRM.
                            </p>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <Users className="w-8 h-8 mb-2 opacity-80" />
                                <div className="text-2xl font-bold">Auto</div>
                                <div className="text-sm text-blue-200">Lead Syncing</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                                <LayoutDashboard className="w-8 h-8 mb-2 opacity-80" />
                                <div className="text-2xl font-bold">Real-time</div>
                                <div className="text-sm text-blue-200">Analytics</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login */}
                    <div className="p-12 flex flex-col justify-center">
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-bold text-gray-900">Connect Your Account</h3>
                            <p className="text-gray-500 mt-2">Choose a method to sync your ads</p>
                        </div>

                        <div className="space-y-4">
                            <div className="w-full">
                                <MetaOAuthButton onConnectSuccess={() => { }} onConnectError={(e) => alert(e)} />
                            </div>

                            <div className="relative flex items-center justify-center my-6">
                                <div className="border-t border-gray-200 w-full" />
                                <span className="absolute bg-white px-4 text-sm text-gray-400">OR</span>
                            </div>

                            <button
                                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-all group"
                                onClick={() => {
                                    const accessToken = `DEMO_TOKEN_GOOGLE_${Math.random().toString(36).substring(2, 15)}`;
                                    connectAccount(accessToken, 'google');
                                }}
                            >
                                <div className="bg-white p-1 rounded-full mr-3">
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                                </div>
                                <span className="font-medium">Sign in with Google (Demo)</span>
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-center text-gray-400">
                            By connecting, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCampaignId) {
        const campaign = adCampaigns.find(c => c.id === selectedCampaignId);
        return (
            <CampaignDetailView
                campaignId={selectedCampaignId}
                campaignName={campaign?.name || 'Campaign Details'}
                onBack={() => setSelectedCampaignId(null)}
            />
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meta Ads Sync</h1>
                    <div className="flex items-center mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="text-sm text-gray-500">
                            Connected as <span className="font-semibold text-gray-700">{metaAccount.name}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="md"
                        icon={RefreshCw}
                        onClick={handleRefreshCampaigns}
                        disabled={isLoading}
                    >
                        Sync Data
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={handleDisconnect}
                        icon={LogOut}
                    >
                        Disconnect
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('campaigns')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'campaigns'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <List className="w-4 h-4 mr-2" />
                        Campaigns
                        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {adCampaigns.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'leads'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        All Leads
                        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                            {allLeads.length}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <AdsOverview campaigns={adCampaigns} />
                )}

                {activeTab === 'campaigns' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        {/* Filters */}
                        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50/50">
                                    <Filter className="w-4 h-4 text-gray-500 mr-2" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-transparent text-sm text-gray-700 focus:outline-none border-none cursor-pointer"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="PAUSED">Paused</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign Name</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Results</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCampaigns.length > 0 ? (
                                        filteredCampaigns.map((campaign) => (
                                            <tr
                                                key={campaign.id}
                                                className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                                onClick={() => setSelectedCampaignId(campaign.id)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{campaign.name}</span>
                                                        <span className="text-xs text-gray-500 mt-0.5">{campaign.objective?.replace(/_/g, ' ').toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full border ${campaign.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        campaign.status === 'PAUSED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            'bg-gray-50 text-gray-600 border-gray-200'
                                                        }`}>
                                                        {campaign.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">{campaign.leads_count || 0} Leads</span>
                                                        <span className="text-xs text-gray-500">{(campaign.clicks || 0).toLocaleString()} Clicks</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                    ${campaign.spend?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button className="text-gray-400 group-hover:text-primary hover:bg-blue-50 p-2 rounded-full transition-all">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center text-gray-500 bg-gray-50/30">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search className="w-10 h-10 text-gray-300 mb-3" />
                                                    <p className="text-base font-medium text-gray-600">No campaigns found</p>
                                                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-gray-900">Captured Leads</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={Download}
                                onClick={handleDownloadLeads}
                                disabled={allLeads.length === 0}
                            >
                                Export CSV
                            </Button>
                        </div>
                        {allLeads.length > 0 ? (
                            <AdsLeadsTable
                                adLeads={allLeads}
                                selectedLeads={selectedLeadsIds}
                                onToggleSelectAll={(checked) => {
                                    if (checked) {
                                        setSelectedLeadsIds(new Set(allLeads.map(l => l.id)));
                                    } else {
                                        setSelectedLeadsIds(new Set());
                                    }
                                }}
                                onToggleSelectLead={(id) => {
                                    const newSelected = new Set(selectedLeadsIds);
                                    if (newSelected.has(id)) {
                                        newSelected.delete(id);
                                    } else {
                                        newSelected.add(id);
                                    }
                                    setSelectedLeadsIds(newSelected);
                                }}
                            />
                        ) : (
                            <div className="py-16 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                    <Users className="w-12 h-12 text-gray-300 mb-3" />
                                    <p className="text-lg font-medium text-gray-600">No leads found</p>
                                    <p className="text-sm text-gray-400 mt-1 max-w-sm">
                                        Leads captured from your Meta Instant Forms will appear here once your campaigns are active.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsSyncPage;