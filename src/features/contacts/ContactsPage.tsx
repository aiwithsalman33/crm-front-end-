import React, { useState, useMemo } from 'react';
import { Sparkles, PlayCircle, Search, Plus, ChevronsUpDown, ChevronDown, ChevronLeft, ChevronRight, Info, ChevronUp, MoreHorizontal, Edit, Upload } from 'lucide-react';
import { useContacts } from '../../contexts/ContactsContext';
import { useUI } from '../../contexts/UIContext';
import type { Contact } from '../../types';
import Button from '../../components/shared/ui/Button';
import EditContactModal from './components/EditContactModal';

const ContactsTable: React.FC<{
    contacts: Contact[];
    requestSort: (key: keyof Contact) => void;
    sortConfig: { key: keyof Contact; direction: 'ascending' | 'descending' } | null;
    onSelectContact: (contact: Contact) => void;
}> = ({ contacts, requestSort, sortConfig, onSelectContact }) => {
    const getSortIcon = (key: keyof Contact) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40 transition-transform duration-200" />;
        }
        return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1 transition-transform duration-200" /> : <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />;
    };

    const [showActions, setShowActions] = useState<string | null>(null);

    const handleEditClick = (contact: Contact) => {
        onSelectContact(contact);
        setShowActions(null);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                                <label className="relative flex items-center justify-center cursor-pointer group/checkbox">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 ease-out shadow-sm group-hover/checkbox:border-primary/60"></div>
                                    <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transform scale-50 peer-checked:scale-100 transition-all duration-200 ease-spring" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                                onClick={() => requestSort('name')}
                                className="flex items-center group hover:text-gray-900 transition-colors duration-200"
                            >
                                Name
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    {getSortIcon('name')}
                                </span>
                            </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                                onClick={() => requestSort('phone')}
                                className="flex items-center group hover:text-gray-900 transition-colors duration-200"
                            >
                                Mobile Number
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    {getSortIcon('phone')}
                                </span>
                            </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tags
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                                onClick={() => requestSort('source')}
                                className="flex items-center group hover:text-gray-900 transition-colors duration-200"
                            >
                                Source
                                <span className="group-hover:scale-110 transition-transform duration-200">
                                    {getSortIcon('source')}
                                </span>
                            </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact, index) => (
                        <tr
                            key={contact.id}
                            className="hover:bg-gray-50 transition-colors duration-200 group"
                            style={{ transitionDelay: `${index * 30}ms` }}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <label className="relative flex items-center justify-center cursor-pointer group/checkbox w-fit">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 ease-out shadow-sm group-hover/checkbox:border-primary/60 group-hover/checkbox:scale-105"></div>
                                    <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transform scale-50 peer-checked:scale-100 transition-all duration-200 ease-spring" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 transition-colors duration-200 group-hover:text-primary">
                                    {contact.name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {contact.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex flex-wrap gap-1">
                                    {contact.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 transition-all duration-300 hover:bg-blue-200 hover:scale-105"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {contact.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowActions(showActions === contact.id ? null : contact.id)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
                                    >
                                        <MoreHorizontal className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
                                    </button>

                                    {showActions === contact.id && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
                                            <div className="py-1" role="menu">
                                                <button
                                                    onClick={() => handleEditClick(contact)}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                                    role="menuitem"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

import { useNavigate } from 'react-router-dom';

// ... other imports

const ContactsPage: React.FC = () => {
    const { contacts } = useContacts();
    const { openCreateContactModal, openEditContactModal, isEditContactModalOpen } = useUI();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Contact; direction: 'ascending' | 'descending' } | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const filteredContacts = useMemo(() => {
        if (!searchQuery) return contacts;
        const lowercasedQuery = searchQuery.toLowerCase();
        return contacts.filter(contact =>
            (contact.name && contact.name.toLowerCase().includes(lowercasedQuery)) ||
            (contact.phone && contact.phone.toLowerCase().includes(lowercasedQuery))
        );
    }, [contacts, searchQuery]);

    const sortedContacts = useMemo(() => {
        let sortableItems = [...filteredContacts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                // Handle potential undefined values for name
                if (sortConfig.key === 'name') {
                    const aName = a.name || '';
                    const bName = b.name || '';
                    if (aName < bName) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aName > bName) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }

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
        return sortableItems;
    }, [filteredContacts, sortConfig]);

    const requestSort = (key: keyof Contact) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Function to handle contact selection for editing
    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        openEditContactModal();
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-3 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="md"
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        >
                            Broadcast
                        </Button>
                        <Button
                            variant="outline"
                            size="md"
                            icon={Upload} // Changed icon
                            onClick={() => navigate('/campaigns/import')}
                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        >
                            Import
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            icon={Plus}
                            onClick={openCreateContactModal}
                            className="bg-primary hover:bg-primary-dark text-white shadow-sm"
                        >
                            Add Contact
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contacts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">

                <div className="transition-all duration-500 ease-in-out">
                    <ContactsTable contacts={sortedContacts} requestSort={requestSort} sortConfig={sortConfig} onSelectContact={handleSelectContact} />
                </div>

                <div className="p-4 border-t flex items-center justify-end text-sm text-text-light space-x-4">
                    <span>1 - {sortedContacts.length} of {sortedContacts.length}</span>
                    <div className="flex items-center space-x-1">
                        <select className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary text-sm p-1 transition-all duration-200">
                            <option>25 per page</option>
                            <option>50 per page</option>
                            <option>100 per page</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={ChevronLeft}
                            disabled={sortedContacts.length <= 25}
                            aria-label="Previous page"
                            className="p-2 transition-all duration-200 transform hover:scale-110"
                        />

                        <Button
                            variant="ghost"
                            size="sm"
                            icon={ChevronRight}
                            disabled={sortedContacts.length <= 25}
                            aria-label="Next page"
                            className="p-2 transition-all duration-200 transform hover:scale-110"
                        />

                    </div>
                </div>
            </div>
            {isEditContactModalOpen && selectedContact && <EditContactModal contact={selectedContact} />}
        </div>
    );
};

export default ContactsPage;