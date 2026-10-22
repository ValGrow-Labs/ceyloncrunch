import React, { useState, useMemo } from 'react';
import {
  Mail,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  Calendar,
  X,
} from 'lucide-react';
import { NewsletterSubscriber } from '../../lib/store';

interface NewsletterTabProps {
  subscribers: NewsletterSubscriber[];
  onToggleSubscriber: (id: string, active: boolean) => Promise<void>;
  onDeleteSubscriber: (id: string) => Promise<void>;
  showToast: (msg: string) => void;
}

export const NewsletterTab: React.FC<NewsletterTabProps> = ({
  subscribers,
  onToggleSubscriber,
  onDeleteSubscriber,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');

  const total = subscribers.length;
  const activeCount = subscribers.filter((s) => s.active).length;
  const unsubscribedCount = total - activeCount;

  const filtered = useMemo(() => {
    return subscribers.filter((s) => {
      const matchSearch =
        !searchQuery || s.email.toLowerCase().includes(searchQuery.toLowerCase());
      let matchStatus = true;
      if (statusFilter === 'active') matchStatus = s.active;
      if (statusFilter === 'unsubscribed') matchStatus = !s.active;
      return matchSearch && matchStatus;
    });
  }, [subscribers, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscriber data to export.');
      return;
    }

    const headers = ['Email', 'Status', 'Subscription Date'];
    const rows = filtered.map((s) => [
      s.email,
      s.active ? 'Active' : 'Unsubscribed',
      s.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join(
      '\n'
    );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `ceylon-crunch-newsletter-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filtered.length} subscriber records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Subscribers
            </p>
            <p className="text-2xl font-serif font-bold text-gray-900">{total}</p>
            <p className="text-[11px] text-gray-400 mt-1">Total mailing list signups</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Active Subscribers
            </p>
            <p className="text-2xl font-serif font-bold text-emerald-600">{activeCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Receiving harvest letters & recipes</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Unsubscribed
            </p>
            <p className="text-2xl font-serif font-bold text-gray-500">{unsubscribedCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Opted out from notifications</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search, Filter, and Export CSV Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subscriber email..."
                className="w-full h-10 pl-10 pr-8 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#1F3D2B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-nowrap pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`h-10 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-[#1F3D2B] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`h-10 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === 'active'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('unsubscribed')}
                className={`h-10 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === 'unsubscribed'
                    ? 'bg-gray-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unsubscribed
              </button>
            </div>
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto h-10 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Subscribers Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-2 opacity-40 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">No subscribers found</p>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Subscriber Cards (Hidden on screens >= md) */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filtered.map((sub) => (
                <div key={sub.id} className="p-4 hover:bg-gray-50/80 transition-colors space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 text-xs break-all">
                      {sub.email}
                    </span>
                    {sub.active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                        Unsubscribed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                    <span className="text-[11px] text-gray-400">{sub.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleSubscriber(sub.id, sub.active)}
                        className={`h-7 px-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          sub.active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {sub.active ? 'Unsubscribe' : 'Reactivate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSubscriber(sub.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Hidden on screens < md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Subscriber Email</th>
                    <th className="py-3.5 px-4">Subscription Status</th>
                    <th className="py-3.5 px-4">Subscribed Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-900">{sub.email}</td>
                      <td className="py-3.5 px-4">
                        {sub.active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Unsubscribed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{sub.createdAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleSubscriber(sub.id, sub.active)}
                            className={`h-7 px-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              sub.active
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {sub.active ? 'Unsubscribe' : 'Reactivate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSubscriber(sub.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete subscriber"
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
          </>
        )}
      </div>
    </div>
  );
};
