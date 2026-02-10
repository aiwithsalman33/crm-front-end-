import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TeamMemberRole = 'Manager' | 'Team Member' | 'Admin';
export type TeamMemberStatus = 'Active' | 'Inactive';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: TeamMemberRole;
    status: TeamMemberStatus;
    avatar: string;
    joinedDate: string;
    permissions: {
        viewLeads: boolean;
        editLeads: boolean;
        deleteLeads: boolean;
        viewDeals: boolean;
        editDeals: boolean;
        manageTeam: boolean;
        viewReports: boolean;
        exportData: boolean;
    };
}

interface TeamContextType {
    teamMembers: TeamMember[];
    addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
    deleteTeamMember: (id: string) => void;
    getTeamMemberById: (id: string) => TeamMember | undefined;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
    {
        id: 'tm_1',
        name: 'Alex Johnson',
        email: 'alex.johnson@ziyacrm.com',
        phone: '+1-555-123-4567',
        role: 'Admin',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        joinedDate: '2024-01-15',
        permissions: {
            viewLeads: true,
            editLeads: true,
            deleteLeads: true,
            viewDeals: true,
            editDeals: true,
            manageTeam: true,
            viewReports: true,
            exportData: true,
        },
    },
    {
        id: 'tm_2',
        name: 'Maria Garcia',
        email: 'maria.garcia@ziyacrm.com',
        phone: '+1-555-987-6543',
        role: 'Manager',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=maria',
        joinedDate: '2024-02-10',
        permissions: {
            viewLeads: true,
            editLeads: true,
            deleteLeads: false,
            viewDeals: true,
            editDeals: true,
            manageTeam: true,
            viewReports: true,
            exportData: true,
        },
    },
    {
        id: 'tm_3',
        name: 'John Smith',
        email: 'john.smith@ziyacrm.com',
        phone: '+1-555-234-5678',
        role: 'Team Member',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=john',
        joinedDate: '2024-03-20',
        permissions: {
            viewLeads: true,
            editLeads: true,
            deleteLeads: false,
            viewDeals: true,
            editDeals: false,
            manageTeam: false,
            viewReports: true,
            exportData: false,
        },
    },
    {
        id: 'tm_4',
        name: 'Sarah Davis',
        email: 'sarah.davis@ziyacrm.com',
        phone: '+1-555-345-6789',
        role: 'Team Member',
        status: 'Active',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        joinedDate: '2024-04-05',
        permissions: {
            viewLeads: true,
            editLeads: true,
            deleteLeads: false,
            viewDeals: true,
            editDeals: false,
            manageTeam: false,
            viewReports: false,
            exportData: false,
        },
    },
    {
        id: 'tm_5',
        name: 'Michael Brown',
        email: 'michael.brown@ziyacrm.com',
        phone: '+1-555-456-7890',
        role: 'Team Member',
        status: 'Inactive',
        avatar: 'https://i.pravatar.cc/150?u=michael',
        joinedDate: '2023-12-01',
        permissions: {
            viewLeads: true,
            editLeads: false,
            deleteLeads: false,
            viewDeals: true,
            editDeals: false,
            manageTeam: false,
            viewReports: false,
            exportData: false,
        },
    },
];

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

    const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
        const newMember: TeamMember = {
            ...member,
            id: `tm_${Date.now()}`,
        };
        setTeamMembers((prev) => [...prev, newMember]);
    };

    const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
        setTeamMembers((prev) =>
            prev.map((member) => (member.id === id ? { ...member, ...updates } : member))
        );
    };

    const deleteTeamMember = (id: string) => {
        setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    };

    const getTeamMemberById = (id: string) => {
        return teamMembers.find((member) => member.id === id);
    };

    return (
        <TeamContext.Provider
            value={{
                teamMembers,
                addTeamMember,
                updateTeamMember,
                deleteTeamMember,
                getTeamMemberById,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within TeamProvider');
    }
    return context;
};
