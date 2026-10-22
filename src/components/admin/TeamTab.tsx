import React, { useState } from 'react';
import {
  Plus,
  ShieldCheck,
  X,
  Mail,
  User,
  Trash2,
  Lock,
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store_manager' | 'Fulfillment_staff';
  status: 'Active' | 'Invited' | 'Inactive';
  created_at?: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Devananth',
    email: 'devananth048@gmail.com',
    role: 'Super Admin',
    status: 'Active',
    created_at: '2026-01-15',
  },
  {
    id: 'team-2',
    name: 'Ceylon Crunch Admin',
    email: 'admin@ceyloncrunch.lk',
    role: 'Super Admin',
    status: 'Active',
    created_at: '2026-01-10',
  },
  {
    id: 'team-3',
    name: 'Priyashantha',
    email: 'operations@ceyloncrunch.lk',
    role: 'Store_manager',
    status: 'Active',
    created_at: '2026-02-01',
  },
];

interface TeamTabProps {
  showToast: (msg: string) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({ showToast }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('ceylon_crunch_team');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TEAM;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Super Admin' | 'Store_manager' | 'Fulfillment_staff'>('Store_manager');
  const [newMemberStatus, setNewMemberStatus] = useState<'Active' | 'Invited'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const saveTeam = (updated: TeamMember[]) => {
    setTeamMembers(updated);
    try {
      localStorage.setItem('ceylon_crunch_team', JSON.stringify(updated));
    } catch {}
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast('Please provide both name and email');
      return;
    }

    setIsSubmitting(true);

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase(),
      role: newMemberRole,
      status: newMemberStatus,
      created_at: new Date().toISOString().split('T')[0],
    };

    const updated = [...teamMembers, newMember];
    saveTeam(updated);

    // Also attempt backend invite API if available
    try {
      await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newMember.email,
          full_name: newMember.name,
          role: newMember.role.toLowerCase().replace(' ', '_'),
        }),
      });
    } catch {
      // Graceful fallback to client storage
    }

    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('Store_manager');
    showToast(`Added ${newMember.name} to team.`);
  };

  const handleDeleteMember = (id: string, name: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    saveTeam(updated);
    setDeletingId(null);
    showToast(`Removed ${name} from team.`);
  };

  const renderRoleBadge = (role: string) => {
    if (role === 'Super Admin') {
      return (
        <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#854D0E]">
          Super Admin
        </span>
      );
    }
    if (role === 'Store_manager' || role === 'Store Manager') {
      return (
        <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
          Store_manager
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
        {role}
      </span>
    );
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
          Active
        </span>
      );
    }
    if (status === 'Invited') {
      return (
        <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
          Invited
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-500">
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Title, Subtitle and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Team & Access Roles
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
            Manage store administrators, managers, and access permissions
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-11 px-5 rounded-2xl bg-[#1E4E35] hover:bg-[#163D28] text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* Main Elevated Card with Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF7F2] rounded-2xl text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5 rounded-l-2xl font-bold">ADMINISTRATOR</th>
                <th className="py-3.5 px-5 font-bold">EMAIL</th>
                <th className="py-3.5 px-5 font-bold">ROLE</th>
                <th className="py-3.5 px-5 rounded-r-2xl font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="py-4 px-5">
                    <span className="font-semibold text-stone-900 text-sm">
                      {member.name}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-stone-600 font-normal">
                    {member.email}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    {renderRoleBadge(member.role)}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex items-center justify-between gap-3">
                      {renderStatusBadge(member.status)}
                      <button
                        onClick={() => setDeletingId(member.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-600 transition-all cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Add Team Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Kasun Silva"
                    className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="name@ceyloncrunch.lk"
                    className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#1E4E35] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Access Role
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Store_manager">Store Manager (Catalog & Fulfillment)</option>
                    <option value="Fulfillment_staff">Fulfillment Staff (Orders Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Account Status
                </label>
                <select
                  value={newMemberStatus}
                  onChange={(e) => setNewMemberStatus(e.target.value as any)}
                  className="w-full h-11 px-4 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-[#1E4E35] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Invited">Send Invite Link</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#1E4E35] hover:bg-[#163D28] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900">Remove Team Member</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to revoke this user's administrator access permissions?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = teamMembers.find((item) => item.id === deletingId);
                  if (m) handleDeleteMember(m.id, m.name);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
