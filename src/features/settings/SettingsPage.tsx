import React, { useState } from 'react';
import { Settings, User, Users, Zap, Building, Mail, Phone, Globe, MapPin, Shield, Bell, Camera, ChevronRight } from 'lucide-react';
import { useUsers } from '../../contexts/UsersContext';
import { useCompany } from '../../contexts/CompanyContext';
import Button from '../../components/shared/ui/Button';

const SettingsPage: React.FC = () => {
    const { users, updateUser } = useUsers();
    const { companyInfo, updateCompanyInfo } = useCompany();
    const currentUser = users.user_1;

    const [activeTab, setActiveTab] = useState('Profile');
    const [userData, setUserData] = useState({
        name: currentUser.name,
        email: 'alex.johnson@example.com',
        avatar: currentUser.avatar,
        phone: '+1 (555) 123-4567',
        timezone: 'America/New_York',
        language: 'English'
    });

    const [companyData, setCompanyData] = useState({
        name: companyInfo.name,
        address: companyInfo.address,
        phone: companyInfo.phone,
        email: companyInfo.email,
        website: companyInfo.website,
        logo: companyInfo.logo
    });

    const handleSaveProfile = () => {
        updateUser('user_1', {
            name: userData.name,
            avatar: userData.avatar
        });
        alert('Profile updated successfully!');
    };

    const handleSaveCompany = () => {
        updateCompanyInfo(companyData);
        alert('Company information updated successfully!');
    };

    const tabs = [
        { id: 'Profile', label: 'My Profile', icon: User, desc: 'Personal details and credentials' },
        { id: 'Company', label: 'Company Info', icon: Building, desc: 'Branding and corporate data' },
        { id: 'Users', label: 'Team access', icon: Users, desc: 'Manage roles & permissions' },
        { id: 'Integrations', label: 'Connections', icon: Zap, desc: 'Sync with external tools' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Settings className="w-7 h-7 text-primary" />
                        </div>
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Control your workspace, security, and team preferences.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                                <div className="text-left">
                                    <p className="text-sm font-bold leading-none mb-1">{tab.label}</p>
                                    <p className={`text-[10px] ${activeTab === tab.id ? 'text-white/70' : 'text-gray-400'}`}>
                                        {tab.desc}
                                    </p>
                                </div>
                                {activeTab === tab.id && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 p-5 bg-gradient-to-br from-indigo-600 to-primary rounded-2xl shadow-lg relative overflow-hidden group">
                        <div className="relative z-10 text-white">
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4" />
                                Security Status
                            </h4>
                            <p className="text-xs text-white/80 leading-relaxed mb-4">
                                Your account is 75% protected. Enable 2FA for maximum security.
                            </p>
                            <button className="text-[10px] font-bold uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors">
                                View Security Log
                            </button>
                        </div>
                        <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col animate-slideIn">
                    {activeTab === 'Profile' && (
                        <ProfileTab userData={userData} setUserData={setUserData} onSave={handleSaveProfile} />
                    )}
                    {activeTab === 'Company' && (
                        <CompanyTab companyData={companyData} setCompanyData={setCompanyData} onSave={handleSaveCompany} />
                    )}
                    {activeTab === 'Users' && (
                        <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                            <p className="text-gray-500 mt-2 max-w-sm">This module is currently being optimized for high-performance teams.</p>
                        </div>
                    )}
                    {activeTab === 'Integrations' && (
                        <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Zap className="w-8 h-8 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">App Ecosystem</h2>
                            <p className="text-gray-500 mt-2 max-w-sm">Connect your CRM to thousands of apps via Webhooks and native API.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const ProfileTab: React.FC<{ userData: any; setUserData: any; onSave: () => void }> = ({ userData, setUserData, onSave }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUserData((prev: any) => ({ ...prev, avatar: event.target?.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-8 space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Profile</h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage your identity and public preferences.</p>
                </div>
                <Button onClick={onSave} variant="primary" className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                    Update Profile
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0 text-center">
                    <div className="relative group mx-auto">
                        <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-32 h-32 rounded-3xl object-cover border-4 border-gray-50 shadow-md ring-1 ring-gray-100 transition-transform group-hover:scale-[1.02]"
                        />
                        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-xl border border-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <Camera className="w-5 h-5 text-gray-600" />
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <User className="w-3 h-3" /> Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all transition-duration-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Phone
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Timezone
                        </label>
                        <select
                            name="timezone"
                            value={userData.timezone}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="America/New_York">Eastern Time (EST)</option>
                            <option value="America/Chicago">Central Time (CST)</option>
                            <option value="America/Denver">Mountain Time (MST)</option>
                            <option value="America/Los_Angeles">Pacific Time (PST)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-50">
                <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 mb-0.5">Notification Preferences</h4>
                        <p className="text-xs text-blue-700/70 font-medium">Control how and when you receive deal alerts and task reminders.</p>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-lg border border-blue-100 shadow-sm hover:bg-blue-50 transition-colors">
                        Configure
                    </button>
                </div>
            </div>
        </div>
    );
};

const CompanyTab: React.FC<{ companyData: any; setCompanyData: any; onSave: () => void }> = ({ companyData, setCompanyData, onSave }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCompanyData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCompanyData((prev: any) => ({ ...prev, logo: event.target?.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-8 space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Workspace Details</h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Branding and essential company information.</p>
                </div>
                <Button onClick={onSave} variant="primary" className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">
                    Save Updates
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-6">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Brand Identity</label>
                        <div className="bg-gray-50/50 p-8 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center group hover:bg-gray-50 hover:border-primary/30 transition-all">
                            <img
                                src={companyData.logo}
                                alt={companyData.name}
                                className="w-full max-w-[180px] h-16 object-contain mb-4 transition-transform group-hover:scale-105"
                            />
                            <label className="px-4 py-2 bg-white shadow-sm border border-gray-100 text-primary text-xs font-bold rounded-lg cursor-pointer hover:shadow-md transition-all">
                                Replace Logo
                                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Corporate Name</label>
                        <input
                            type="text"
                            name="name"
                            value={companyData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Website URL</label>
                        <input
                            type="text"
                            name="website"
                            value={companyData.website}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 font-sans">Support Email</label>
                        <input
                            type="email"
                            name="email"
                            value={companyData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Contact Line</label>
                        <input
                            type="text"
                            name="phone"
                            value={companyData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Registered Address
                        </label>
                        <textarea
                            name="address"
                            value={companyData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;