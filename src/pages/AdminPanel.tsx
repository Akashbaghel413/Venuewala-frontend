import { useState, useMemo } from 'react';
import {
  LayoutDashboard, Building2, Users, Calendar, IndianRupee,
  Star, FileText, Settings, Bell, LogOut, Check, X, Eye,
  Flag, Trash2, Download, Search, RefreshCw,
  CheckCircle, AlertCircle, Printer,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  adminVenues, adminUsers, adminBookings, adminPayouts,
  adminReviews, activityLog, bookingsByType, kpiData,
} from '../data/admin';
import StatusBadge from '../components/dashboard/StatusBadge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

type AdminTab = 'dashboard' | 'venues' | 'users' | 'bookings' | 'payouts' | 'reviews' | 'reports' | 'settings';

const sidebarItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'venues', label: 'Venues', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'payouts', label: 'Payouts', icon: IndianRupee },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const COLORS = ['#1D9E75', '#D95D39', '#E2B93F', '#8A5565', '#9B8AA5', '#C5C5C5'];

/* ── Toast helper ── */
function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  return { toast, setToast };
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { toast, setToast } = useToast();

  const pendingCount = adminVenues.filter((v) => v.status === 'pending').length;

  return (
    <div className="min-h-screen bg-cream pb-16 lg:pb-0">
      {/* Top header */}
      <div className="bg-[#1A1A2E] border-b border-white/10 sticky top-0 z-30">
        <div className="container-app flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="text-sm font-semibold text-white">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-white/60 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-coral-500" />
              )}
            </button>
            <span className="hidden sm:inline text-sm text-white/80">Super Admin</span>
            <button className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-app py-6">
        <div className="flex gap-6">
          {/* Desktop dark sidebar */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <nav className="sticky top-20 rounded-card bg-[#1A1A2E] p-2 shadow-sm space-y-0.5">
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-input text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {item.id === 'venues' && pendingCount > 0 && (
                      <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'venues' && <VenuesTab setToast={setToast} />}
            {activeTab === 'users' && <UsersTab setToast={setToast} />}
            {activeTab === 'bookings' && <BookingsTab setToast={setToast} />}
            {activeTab === 'payouts' && <PayoutsTab setToast={setToast} />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'reports' && <ReportsTab setToast={setToast} />}
            {activeTab === 'settings' && <SettingsTab setToast={setToast} />}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-card border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A2E] border-t border-white/10 z-40">
        <div className="flex overflow-x-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 min-w-16 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${activeTab === item.id ? 'text-primary-400' : 'text-white/40'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label.slice(0, 6)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
function DashboardTab() {
  const revenue12 = [
    { month: 'Jul 25', revenue: 950000 }, { month: 'Aug 25', revenue: 1100000 },
    { month: 'Sep 25', revenue: 1050000 }, { month: 'Oct 25', revenue: 1200000 },
    { month: 'Nov 25', revenue: 1450000 }, { month: 'Dec 25', revenue: 1680000 },
    { month: 'Jan', revenue: 1200000 }, { month: 'Feb', revenue: 1450000 },
    { month: 'Mar', revenue: 1680000 }, { month: 'Apr', revenue: 1520000 },
    { month: 'May', revenue: 1890000 }, { month: 'Jun', revenue: 2150000 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h2>
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Venues', value: kpiData.totalVenues, icon: Building2, color: 'text-primary-500' },
          { label: 'Active Bookings', value: kpiData.activeBookings, icon: Calendar, color: 'text-primary-500' },
          { label: 'Revenue Today', value: `₹${(kpiData.revenueToday / 1000).toFixed(0)}K`, icon: IndianRupee, color: 'text-amber-500' },
          { label: 'New Users Today', value: kpiData.newUsersToday, icon: Users, color: 'text-coral-500' },
        ].map((k) => (
          <div key={k.label} className="rounded-card bg-white p-4 shadow-sm">
            <k.icon className={`h-5 w-5 mb-2 ${k.color}`} />
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-card bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Monthly Revenue — Last 12 Months</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(v) => [`₹${(v as number).toLocaleString('en-IN')}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#1D9E75" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Bookings by Venue Type</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" paddingAngle={2} dataKey="value" label={({ value }) => `${value}%`}>
                  {bookingsByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-[10px]">
            {bookingsByType.map((b, i) => (
              <span key={b.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />{b.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
      <div className="rounded-card bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {activityLog.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 text-sm">
              <div className={`h-2 w-2 rounded-full shrink-0 ${log.type === 'booking' ? 'bg-primary-500' : log.type === 'payment' ? 'bg-amber-500' : log.type === 'venue' ? 'bg-purple-500' : log.type === 'user' ? 'bg-blue-500' : 'bg-coral-500'}`} />
              <span className="flex-1 text-gray-700">{log.action}</span>
              <span className="text-gray-400">{log.user}</span>
              <span className="text-gray-400 text-xs whitespace-nowrap">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Venues ── */
function VenuesTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [venues, setVenues] = useState(adminVenues);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendModal, setSuspendModal] = useState<string | null>(null);
  const [viewVenue, setViewVenue] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? venues : venues.filter((v) => v.status === filter);
    if (search) list = list.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.owner.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [venues, filter, search]);

  const handleVerify = (id: string) => {
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'verified' as const } : v)));
    setToast({ type: 'success', message: 'Venue verified successfully' });
  };

  const handleReject = (id: string) => {
    setRejectModal(null);
    setRejectReason('');
    setVenues((prev) => prev.filter((v) => v.id !== id));
    setToast({ type: 'success', message: 'Venue rejected and removed' });
  };

  const handleSuspend = (id: string) => {
    setSuspendModal(null);
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'suspended' as const } : v)));
    setToast({ type: 'success', message: 'Venue suspended' });
  };

  const venueToView = venues.find((v) => v.id === viewVenue);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Venue Management</h2>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'pending', 'verified', 'suspended'] as const).map((f) => {
          const count = f === 'all' ? venues.length : venues.filter((v) => v.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? (f === 'pending' ? 'bg-amber-500 text-white' : 'bg-primary-500 text-white') : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {f === 'all' ? 'All' : f} ({count})
            </button>
          );
        })}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search venues..." className="rounded-input border border-gray-200 pl-8 pr-3 py-1.5 text-xs w-48 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" />
        </div>
      </div>

      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">Photo</th><th className="p-3">Name</th><th className="p-3">Owner</th><th className="p-3">City</th><th className="p-3">Type</th><th className="p-3">Listed</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-gray-50">
                <td className="p-3"><div className="h-9 w-12 rounded-input bg-gray-100 overflow-hidden"><img src={`https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100`} alt="" className="h-full w-full object-cover" /></div></td>
                <td className="p-3 font-medium text-gray-900">{v.name}</td>
                <td className="p-3 text-gray-500">{v.owner}</td>
                <td className="p-3 text-gray-500">{v.city}</td>
                <td className="p-3 text-gray-500">{v.type}</td>
                <td className="p-3 text-gray-500">{v.createdAt}</td>
                <td className="p-3"><StatusBadge status={v.status} /></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {v.status === 'pending' && (
                      <>
                        <button className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-full transition-colors" title="Verify" onClick={() => handleVerify(v.id)}><Check className="h-4 w-4" /></button>
                        <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-full transition-colors" title="Reject" onClick={() => setRejectModal(v.id)}><X className="h-4 w-4" /></button>
                      </>
                    )}
                    {v.status === 'verified' && (
                      <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-full transition-colors" title="Suspend" onClick={() => setSuspendModal(v.id)}><Flag className="h-4 w-4" /></button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors" title="View" onClick={() => setViewVenue(v.id)}><Eye className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Venue">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Please provide a reason for rejecting this venue listing.</p>
          <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Insufficient documentation, incorrect details, etc." className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none" />
          <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</Button><Button variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleReject(rejectModal!)}>Reject Venue</Button></div>
        </div>
      </Modal>

      {/* Suspend modal */}
      <Modal open={!!suspendModal} onClose={() => setSuspendModal(null)} title="Suspend Venue">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Are you sure you want to suspend this venue? It will no longer appear in search results.</p>
          <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setSuspendModal(null)}>Cancel</Button><Button variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleSuspend(suspendModal!)}>Suspend</Button></div>
        </div>
      </Modal>

      {/* View modal */}
      <Modal open={!!viewVenue && !!venueToView} onClose={() => setViewVenue(null)} title={venueToView?.name || ''}>
        {venueToView && (
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="h-20 w-28 rounded-input bg-gray-100 overflow-hidden"><img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200" alt="" className="h-full w-full object-cover" /></div>
              <div>
                <p className="font-semibold text-gray-900">{venueToView.name}</p>
                <p className="text-gray-500">{venueToView.owner}</p>
                <p className="text-gray-500">{venueToView.city}</p>
                <p className="mt-1"><StatusBadge status={venueToView.status} /></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-input bg-gray-50 p-2"><span className="text-gray-400">Type</span><p className="font-medium">{venueToView.type}</p></div>
              <div className="rounded-input bg-gray-50 p-2"><span className="text-gray-400">Listed</span><p className="font-medium">{venueToView.createdAt}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ── Users ── */
function UsersTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(adminUsers);
  const [viewUser, setViewUser] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? users : users.filter((u) => u.status === filter);
    if (search) list = list.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [users, filter, search]);

  const handleSuspend = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'suspended' as const } : u)));
    setToast({ type: 'success', message: 'User suspended' });
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setToast({ type: 'success', message: 'User deleted' });
  };

  const userToView = users.find((u) => u.id === viewUser);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'active', 'suspended'] as const).map((f) => {
          const count = f === 'all' ? users.length : users.filter((u) => u.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {f} ({count})
            </button>
          );
        })}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="rounded-input border border-gray-200 pl-8 pr-3 py-1.5 text-xs w-48 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" />
        </div>
      </div>

      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">Avatar</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Bookings</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="p-3"><div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">{u.name.charAt(0)}</div></td>
                <td className="p-3 font-medium text-gray-900"><button onClick={() => setViewUser(u.id)} className="hover:text-primary-500 transition-colors">{u.name}</button></td>
                <td className="p-3 text-gray-500">{u.email}</td>
                <td className="p-3 text-gray-500">{u.phone}</td>
                <td className="p-3 text-gray-500">{u.totalBookings}</td>
                <td className="p-3 text-gray-500">{u.joinedDate}</td>
                <td className="p-3"><StatusBadge status={u.status === 'active' ? 'active' : 'suspended'} /></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors" onClick={() => setViewUser(u.id)}><Eye className="h-4 w-4" /></button>
                    {u.status === 'active' && <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-full transition-colors" onClick={() => handleSuspend(u.id)}><Flag className="h-4 w-4" /></button>}
                    <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-full transition-colors" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User detail modal */}
      <Modal open={!!viewUser && !!userToView} onClose={() => setViewUser(null)} title={userToView?.name || ''}>
        {userToView && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-600">{userToView.name.charAt(0)}</div>
              <div>
                <p className="font-semibold text-gray-900">{userToView.name}</p>
                <p className="text-gray-500">{userToView.email}</p>
                <p className="text-gray-500">{userToView.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-input bg-gray-50 p-2 text-center"><p className="text-lg font-bold text-gray-900">{userToView.totalBookings}</p><p className="text-[10px] text-gray-500">Bookings</p></div>
              <div className="rounded-input bg-gray-50 p-2 text-center"><p className="text-lg font-bold text-gray-900">₹{(userToView.totalBookings * 45000).toLocaleString('en-IN')}</p><p className="text-[10px] text-gray-500">Total Spent</p></div>
              <div className="rounded-input bg-gray-50 p-2 text-center"><p className="text-lg font-bold text-gray-900">{userToView.joinedDate}</p><p className="text-[10px] text-gray-500">Joined</p></div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">Recent Bookings</h4>
              <div className="space-y-1.5">
                {adminBookings.filter((b) => b.client === userToView.name).map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs"><span>{b.venue} — {b.date}</span><span className="font-medium">₹{b.amount.toLocaleString('en-IN')}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ── Bookings ── */
function BookingsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewBooking, setViewBooking] = useState<string | null>(null);
  const [refundModal, setRefundModal] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');

  const filtered = useMemo(() => {
    let list = statusFilter === 'all' ? adminBookings : adminBookings.filter((b) => b.status === statusFilter);
    if (cityFilter !== 'all') list = list.filter((b) => b.city === cityFilter);
    if (typeFilter !== 'all') list = list.filter((b) => b.venue.toLowerCase().includes(typeFilter.toLowerCase()));
    if (dateFrom) list = list.filter((b) => b.date >= dateFrom);
    if (dateTo) list = list.filter((b) => b.date <= dateTo);
    return list;
  }, [statusFilter, cityFilter, typeFilter, dateFrom, dateTo]);

  const totalAmount = filtered.reduce((a, b) => a + b.amount, 0);

  const uniqueCities = [...new Set(adminBookings.map((b) => b.city))];

  const bookingToView = adminBookings.find((b) => b.id === viewBooking);

  const handleRefund = (id: string) => {
    setRefundModal(null);
    setRefundAmount('');
    setToast({ type: 'success', message: `Refund of ₹${refundAmount} issued for ${id}` });
  };

  const handleExport = () => {
    setToast({ type: 'success', message: 'Bookings exported to CSV' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Bookings Master</h2>
        <Button variant="outline" className="text-xs py-2 px-3" onClick={handleExport}><Download className="h-3.5 w-3.5" />Export CSV</Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs" />
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs"><option value="all">All Cities</option>{uniqueCities.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs"><option value="all">All Types</option><option value="Farmhouse">Farmhouse</option><option value="Banquet">Banquet</option><option value="Community">Community</option></select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-input border border-gray-200 px-3 py-1.5 text-xs"><option value="all">All Status</option><option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option></select>
      </div>

      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">ID</th><th className="p-3">Venue</th><th className="p-3">Client</th><th className="p-3">Owner</th><th className="p-3">Date</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-gray-50">
                <td className="p-3 font-mono text-xs text-gray-500">{b.id}</td>
                <td className="p-3 font-medium text-gray-900">{b.venue}</td>
                <td className="p-3 text-gray-500">{b.client}</td>
                <td className="p-3 text-gray-500">{b.city}</td>
                <td className="p-3 text-gray-500">{b.date}</td>
                <td className="p-3 font-semibold">₹{b.amount.toLocaleString('en-IN')}</td>
                <td className="p-3"><StatusBadge status={b.status} /></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors" onClick={() => setViewBooking(b.id)}><Eye className="h-4 w-4" /></button>
                    {b.paymentStatus === 'paid' && <button className="p-1.5 text-coral-500 hover:bg-coral-50 rounded-full transition-colors" title="Refund" onClick={() => setRefundModal(b.id)}><RefreshCw className="h-4 w-4" /></button>}
                    <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-full transition-colors" title="Flag"><Flag className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-gray-50 font-semibold">
              <td className="p-3 text-gray-500" colSpan={5}>Total ({filtered.length} bookings)</td>
              <td className="p-3 text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</td>
              <td className="p-3" colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>

      {/* View modal */}
      <Modal open={!!viewBooking && !!bookingToView} onClose={() => setViewBooking(null)} title={`Booking ${bookingToView?.id}`}>
        {bookingToView && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-input bg-gray-50 p-2"><span className="text-gray-400">Venue</span><p className="font-medium">{bookingToView.venue}</p></div>
              <div className="rounded-input bg-gray-50 p-2"><span className="text-gray-400">Client</span><p className="font-medium">{bookingToView.client}</p></div>
              <div className="rounded-input bg-gray-50 p-2"><span className="text-gray-400">Date</span><p className="font-medium">{bookingToView.date}</p></div>
              <div className="rounded-input bg-gray-50 p-2"><span className="text-gray-400">Amount</span><p className="font-medium">₹{bookingToView.amount.toLocaleString('en-IN')}</p></div>
            </div>
            <div className="flex gap-2"><StatusBadge status={bookingToView.status} /><StatusBadge status={bookingToView.paymentStatus === 'paid' ? 'confirmed' : bookingToView.paymentStatus === 'pending' ? 'pending' : 'cancelled'} /></div>
          </div>
        )}
      </Modal>

      {/* Refund modal */}
      <Modal open={!!refundModal} onClose={() => { setRefundModal(null); setRefundAmount(''); }} title="Issue Refund">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Enter the refund amount for booking {refundModal}.</p>
          <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="Amount in ₹" className="w-full rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" />
          <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => { setRefundModal(null); setRefundAmount(''); }}>Cancel</Button><Button variant="primary" className="flex-1" onClick={() => handleRefund(refundModal!)}>Issue Refund</Button></div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Payouts ── */
function PayoutsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [tab, setTab] = useState<'pending' | 'released'>('pending');
  const [releaseModal, setReleaseModal] = useState<string | null>(null);
  const [payoutList, setPayoutList] = useState(adminPayouts);

  const pending = payoutList.filter((p) => p.status !== 'completed');
  const completed = payoutList.filter((p) => p.status === 'completed');

  const handleRelease = (id: string) => {
    setReleaseModal(null);
    setPayoutList((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'completed' as const } : p)));
    setToast({ type: 'success', message: 'Payment released successfully' });
  };

  const payoutToRelease = payoutList.find((p) => p.id === releaseModal);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Payouts</h2>
      <div className="flex gap-2 mb-4">
        {(['pending', 'released'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            {t} ({t === 'pending' ? pending.length : completed.length})
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">ID</th><th className="p-3">Owner</th><th className="p-3">Venue</th><th className="p-3">Bookings</th><th className="p-3">Amount</th><th className="p-3">Bank Account</th><th className="p-3">Action</th></tr></thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="p-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="p-3 font-medium text-gray-900">{p.owner}</td>
                  <td className="p-3 text-gray-500">{p.venue}</td>
                  <td className="p-3 text-gray-500">{Math.floor(Math.random() * 10 + 2)}</td>
                  <td className="p-3 font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-gray-500">{p.bank}</td>
                  <td className="p-3"><Button variant="primary" className="text-xs py-1 px-3" onClick={() => setReleaseModal(p.id)}>Release Payment</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'released' && (
        <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">ID</th><th className="p-3">Owner</th><th className="p-3">Venue</th><th className="p-3">Amount</th><th className="p-3">Bank</th><th className="p-3">Release Date</th><th className="p-3">Txn ID</th></tr></thead>
            <tbody>
              {completed.map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="p-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="p-3 font-medium text-gray-900">{p.owner}</td>
                  <td className="p-3 text-gray-500">{p.venue}</td>
                  <td className="p-3 font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-gray-500">{p.bank}</td>
                  <td className="p-3 text-gray-500">{p.requestedDate}</td>
                  <td className="p-3 font-mono text-xs text-gray-500">TXN{Math.floor(Math.random() * 1000000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Release confirmation modal */}
      <Modal open={!!releaseModal && !!payoutToRelease} onClose={() => setReleaseModal(null)} title="Confirm Payment Release">
        {payoutToRelease && (
          <div className="space-y-4">
            <div className="rounded-input bg-primary-50 border border-primary-200 p-3 text-center">
              <p className="text-xs text-primary-600 font-medium">Amount to release</p>
              <p className="text-2xl font-bold text-primary-700 mt-1">₹{payoutToRelease.amount.toLocaleString('en-IN')}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Owner</span><span className="font-medium">{payoutToRelease.owner}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Venue</span><span className="font-medium">{payoutToRelease.venue}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium">{payoutToRelease.bank}</span></div>
            </div>
            <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setReleaseModal(null)}>Cancel</Button><Button variant="primary" className="flex-1" onClick={() => handleRelease(releaseModal!)}>Confirm Release</Button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ── Reviews ── */
function ReviewsTab() {
  const [reviews] = useState(adminReviews);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
      <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">Reviewer</th><th className="p-3">Venue</th><th className="p-3">Rating</th><th className="p-3">Text</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-b border-gray-50">
                <td className="p-3 font-medium text-gray-900">{r.reviewer}</td>
                <td className="p-3 text-gray-500">{r.venue}</td>
                <td className="p-3 text-gray-500">{r.rating} ★</td>
                <td className="p-3 text-gray-500 max-w-xs truncate">{r.text}</td>
                <td className="p-3 text-gray-500">{r.date}</td>
                <td className="p-3">{r.flagged ? <StatusBadge status="cancelled" /> : <StatusBadge status="verified" />}</td>
                <td className="p-3"><div className="flex gap-1"><button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-full"><Eye className="h-4 w-4" /></button><button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-full"><Flag className="h-4 w-4" /></button><button className="p-1.5 text-red-400 hover:bg-red-50 rounded-full"><Trash2 className="h-4 w-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Reports ── */
function ReportsTab({ setToast }: { setToast: (t: { type: 'success' | 'error'; message: string }) => void }) {
  const [reportType, setReportType] = useState<'revenue' | 'bookings' | 'users' | 'venues'>('revenue');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const revenueData = [
    { date: '2026-06-01', bookings: 12, revenue: 125000 },
    { date: '2026-06-02', bookings: 8, revenue: 98000 },
    { date: '2026-06-03', bookings: 15, revenue: 156000 },
    { date: '2026-06-04', bookings: 10, revenue: 112000 },
    { date: '2026-06-05', bookings: 18, revenue: 189000 },
  ];

  const totalRevenue = revenueData.reduce((a, r) => a + r.revenue, 0);
  const platformFees = Math.round(totalRevenue * 0.05);
  const gstOnFees = Math.round(platformFees * 0.18);
  const netRevenue = totalRevenue - platformFees - gstOnFees;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reports</h2>

      {/* Date range + type tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-input border border-gray-200 px-3 py-2 text-sm" />
          <span className="text-gray-400 self-center">→</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-input border border-gray-200 px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-1 ml-auto">
          {(['revenue', 'bookings', 'users', 'venues'] as const).map((t) => (
            <button key={t} onClick={() => setReportType(t)} className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${reportType === t ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>{t}</button>
          ))}
        </div>
      </div>

      {reportType === 'revenue' && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K` },
              { label: 'Platform Fees', value: `₹${(platformFees / 1000).toFixed(0)}K` },
              { label: 'GST Collected', value: `₹${(gstOnFees / 1000).toFixed(0)}K` },
              { label: 'Net Revenue', value: `₹${(netRevenue / 1000).toFixed(0)}K` },
            ].map((s) => (
              <div key={s.label} className="rounded-card bg-white p-4 shadow-sm">
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-card bg-white shadow-sm overflow-hidden overflow-x-auto mb-5">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-left text-gray-500"><th className="p-3">Date</th><th className="p-3">Bookings</th><th className="p-3">Revenue</th></tr></thead>
              <tbody>
                {revenueData.map((r) => (
                  <tr key={r.date} className="border-b border-gray-50">
                    <td className="p-3 text-gray-500">{r.date}</td>
                    <td className="p-3 text-gray-900">{r.bookings}</td>
                    <td className="p-3 font-semibold">₹{r.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportType === 'bookings' && (
        <div className="rounded-card bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Booking report data would be generated here based on the selected date range.</p>
        </div>
      )}

      {reportType === 'users' && (
        <div className="rounded-card bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">User growth report data would be generated here based on the selected date range.</p>
        </div>
      )}

      {reportType === 'venues' && (
        <div className="rounded-card bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Venue listing report data would be generated here based on the selected date range.</p>
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <Button variant="primary" className="text-xs py-2" onClick={() => setToast({ type: 'success', message: 'Report exported to CSV' })}><Download className="h-3.5 w-3.5" />Export CSV</Button>
        <Button variant="outline" className="text-xs py-2" onClick={() => setToast({ type: 'success', message: 'Report sent to printer' })}><Printer className="h-3.5 w-3.5" />Print</Button>
      </div>
    </div>
  );
}

/* ── Settings ── */
function SettingsTab({ setToast }: { setToast: (_t: { type: 'success' | 'error'; message: string }) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
      <div className="rounded-card bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Admin Preferences</h3>
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Platform Fee (%)</label><input type="number" defaultValue="5" className="w-full max-w-xs rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Support Email</label><input type="email" defaultValue="support@venuewala.in" className="w-full max-w-xs rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Support Phone</label><input type="tel" defaultValue="+91 98765 43210" className="w-full max-w-xs rounded-input border border-gray-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" /></div>
        </div>
        <Button variant="primary" className="mt-4 text-sm" onClick={() => setToast({ type: 'success', message: 'Settings saved' })}>Save Settings</Button>
      </div>
    </div>
  );
}
