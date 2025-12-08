import { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      setStats({
        total_users: 0,
        new_users_this_month: 0,
        active_sessions: 0,
        pending_crisis_alerts: 0,
        revenue_mtd: 0,
        revenue_growth: 0,
        users_by_tier: {
          shift_session: 0,
          clarity_plus: 0,
          mastery: 0
        }
      });
      setUsers([]);
      setCrisisAlerts([]);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load admin dashboard');
      setStats({});
      setUsers([]);
      setCrisisAlerts([]);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="btn btn-secondary">Export Data</button>
          <button className="btn btn-primary">System Settings</button>
        </div>
      </header>

      <nav className="admin-nav">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'crisis' ? 'active' : ''}
          onClick={() => setActiveTab('crisis')}
        >
          Crisis Alerts
          {crisisAlerts.filter(a => a.status === 'pending').length > 0 && (
            <span className="alert-badge">
              {crisisAlerts.filter(a => a.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'users' && <UsersTab users={users} />}
        {activeTab === 'crisis' && <CrisisTab alerts={crisisAlerts} onRefresh={fetchDashboardData} />}
        {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
      </main>
    </div>
  );
};

const OverviewTab = ({ stats }: { stats: any }) => (
  <div className="overview-tab">
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Users</h3>
        <p className="stat-number">{stats?.total_users || 0}</p>
        <p className="stat-change positive">+{stats?.new_users_this_month || 0} this month</p>
      </div>

      <div className="stat-card">
        <h3>Active Sessions</h3>
        <p className="stat-number">{stats?.active_sessions || 0}</p>
        <p className="stat-label">Currently in progress</p>
      </div>

      <div className="stat-card">
        <h3>Crisis Alerts</h3>
        <p className="stat-number critical">{stats?.pending_crisis_alerts || 0}</p>
        <p className="stat-label">Requiring attention</p>
      </div>

      <div className="stat-card">
        <h3>Revenue (MTD)</h3>
        <p className="stat-number">${stats?.revenue_mtd || 0}</p>
        <p className="stat-change positive">+{stats?.revenue_growth || 0}% vs last month</p>
      </div>
    </div>

    <div className="tier-breakdown">
      <h3>Users by Tier</h3>
      <div className="tier-stats">
        <div className="tier-stat">
          <span className="tier-name">Shift Session</span>
          <span className="tier-count">{stats?.users_by_tier?.shift_session || 0}</span>
        </div>
        <div className="tier-stat">
          <span className="tier-name">Clarity+</span>
          <span className="tier-count">{stats?.users_by_tier?.clarity_plus || 0}</span>
        </div>
        <div className="tier-stat">
          <span className="tier-name">Mastery</span>
          <span className="tier-count">{stats?.users_by_tier?.mastery || 0}</span>
        </div>
      </div>
    </div>
  </div>
);

const UsersTab = ({ users }: { users: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || user.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="users-tab">
      <div className="users-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tiers</option>
          <option value="shift_session">Shift Session</option>
          <option value="clarity_plus">Clarity+</option>
          <option value="mastery">Mastery</option>
        </select>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`tier-badge ${user.tier}`}>{user.tier}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>{user.status}</span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-small">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CrisisTab = ({ alerts, onRefresh }: { alerts: any[]; onRefresh: () => void }) => {
  const handleResolve = async (alertId: number) => {
    try {
      // TODO: Implement API call
      console.log('Resolving alert:', alertId);
      onRefresh();
    } catch (err) {
      console.error('Failed to resolve alert');
    }
  };

  return (
    <div className="crisis-tab">
      <h2>Crisis Alerts</h2>
      {alerts.length > 0 ? (
        <div className="crisis-list">
          {alerts.map(alert => (
            <div key={alert.id} className={`crisis-card ${alert.status}`}>
              <div className="crisis-header">
                <h4>{alert.user_name}</h4>
                <span className={`crisis-severity ${alert.severity}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="crisis-body">
                <p><strong>Detected:</strong> {new Date(alert.created_at).toLocaleString()}</p>
                <p><strong>Reason:</strong> {alert.reason}</p>
                <p><strong>Contact:</strong> {alert.user_email} | {alert.user_phone}</p>
              </div>
              <div className="crisis-actions">
                {alert.status === 'pending' && (
                  <>
                    <button className="btn btn-primary" onClick={() => handleResolve(alert.id)}>
                      Mark Resolved
                    </button>
                    <button className="btn btn-secondary">Contact User</button>
                  </>
                )}
                {alert.status === 'resolved' && (
                  <p className="resolved-note">Resolved by {alert.resolved_by} on {new Date(alert.resolved_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-alerts">
          <p>No crisis alerts at this time</p>
        </div>
      )}
    </div>
  );
};

const AnalyticsTab = ({ stats }: { stats: any }) => (
  <div className="analytics-tab">
    <h2>Platform Analytics</h2>
    
    <div className="analytics-grid">
      <div className="analytics-card">
        <h3>Session Completion Rate</h3>
        <p className="analytics-number">{stats?.completion_rate || 0}%</p>
        <p className="analytics-label">Of scheduled sessions completed</p>
      </div>

      <div className="analytics-card">
        <h3>Average Wellness Score</h3>
        <p className="analytics-number">{stats?.avg_wellness_score || 0}/100</p>
        <p className="analytics-label">Across all active users</p>
      </div>

      <div className="analytics-card">
        <h3>User Retention</h3>
        <p className="analytics-number">{stats?.retention_rate || 0}%</p>
        <p className="analytics-label">30-day retention rate</p>
      </div>

      <div className="analytics-card">
        <h3>Crisis Detection Rate</h3>
        <p className="analytics-number">{stats?.crisis_detection_rate || 0}%</p>
        <p className="analytics-label">Of assessments flagged</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
