'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Lincoln High School Renovation',
      category: 'School Construction',
      status: 'completed',
      budget: 5000000,
      progress: 100,
    },
    {
      id: 2,
      title: 'Downtown Commercial Complex',
      category: 'Commercial',
      status: 'in-progress',
      budget: 8500000,
      progress: 65,
    },
  ]);

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'Interested in renovations',
      date: '2024-01-15',
      status: 'new',
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-elite-dark via-elite-navy to-elite-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8 border border-elite-blue/20">
            <h1 className="text-4xl font-bold gradient-text mb-2">BuildCore</h1>
            <p className="text-white/60 mb-8">Admin Dashboard</p>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-white mb-3 font-semibold">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-lg bg-elite-navy/50 border border-elite-blue/30 text-white placeholder-white/40 focus:outline-none focus:border-elite-blue"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 font-semibold"
              >
                Login
              </button>
            </form>

            <p className="text-white/40 text-sm mt-4 text-center">
              🔐 Demo password: admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elite-dark">
      {/* Header */}
      <header className="bg-elite-navy border-b border-elite-blue/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold gradient-text">BuildCore Elite</h1>
            <p className="text-white/60 text-sm">Admin Dashboard</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 text-white/60 hover:text-elite-blue transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 border-b border-elite-blue/20 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'projects', label: '🏗️ Projects' },
            { id: 'contacts', label: '📧 Contacts' },
            { id: 'analytics', label: '📈 Analytics' },
            { id: 'settings', label: '⚙️ Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-elite-blue border-b-2 border-elite-blue'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', value: '45', icon: '🏗️', color: 'from-elite-blue' },
                { label: 'Active Inquiries', value: '12', icon: '📧', color: 'from-elite-accent' },
                { label: 'Site Views', value: '2.4K', icon: '👁️', color: 'from-elite-gold' },
                { label: 'Revenue', value: '$850K', icon: '💰', color: 'from-green-500' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`glass rounded-xl p-6 border border-elite-blue/20 bg-gradient-to-br ${stat.color}/10`}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-6 border border-elite-blue/20">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  '✅ New contact inquiry from ABC Corporation',
                  '✨ Website viewed 156 times today',
                  '📝 Portfolio updated with new project',
                  '📧 Contact form submission received',
                ].map((activity, i) => (
                  <div key={i} className="text-white/70 text-sm border-b border-elite-blue/10 pb-3">
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Projects</h2>
              <button className="btn-primary">+ Add Project</button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="glass rounded-xl p-6 border border-elite-blue/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{project.title}</h3>
                      <p className="text-white/60 text-sm">{project.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-elite-blue/20 text-elite-blue rounded text-sm hover:bg-elite-blue/30">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30">
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          project.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-elite-blue/20 text-elite-blue'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Budget</p>
                      <p className="text-white font-semibold">${(project.budget / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Progress</p>
                      <div className="w-full bg-elite-navy/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-elite-blue to-elite-accent h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-white/60 text-xs mt-1">{project.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Inquiries</h2>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="glass rounded-xl p-6 border border-elite-blue/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                      <p className="text-elite-blue text-sm">{contact.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold">
                      {contact.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-white/60 text-sm mb-2">Subject: {contact.subject}</p>
                    <p className="text-white/80">{contact.message}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-white/40 text-sm">{contact.date}</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 text-sm font-semibold">
                        Mark Done
                      </button>
                      <button className="px-4 py-2 bg-elite-blue/20 text-elite-blue rounded hover:bg-elite-blue/30 text-sm font-semibold">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6 border border-elite-blue/20">
                <h3 className="text-lg font-bold mb-4">Page Views</h3>
                <div className="text-4xl font-bold gradient-text mb-2">2,451</div>
                <p className="text-green-400 text-sm">↑ 12% increase this week</p>
              </div>

              <div className="glass rounded-xl p-6 border border-elite-blue/20">
                <h3 className="text-lg font-bold mb-4">Conversion Rate</h3>
                <div className="text-4xl font-bold gradient-text mb-2">3.8%</div>
                <p className="text-green-400 text-sm">↑ 0.5% increase this week</p>
              </div>

              <div className="glass rounded-xl p-6 border border-elite-blue/20 md:col-span-2">
                <h3 className="text-lg font-bold mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Home', views: 1250 },
                    { name: 'Portfolio', views: 842 },
                    { name: 'Services', views: 628 },
                    { name: 'Contact', views: 421 },
                  ].map((page, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-white/80">{page.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-elite-navy/50 rounded-full h-2">
                          <div
                            className="bg-elite-blue h-2 rounded-full"
                            style={{ width: `${(page.views / 1250) * 100}%` }}
                          />
                        </div>
                        <span className="text-white/60 text-sm w-12 text-right">{page.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold">Settings</h2>

            <div className="glass rounded-xl p-6 border border-elite-blue/20">
              <h3 className="text-lg font-bold mb-4">Business Information</h3>
              <div className="space-y-4">
                {[
                  { label: 'Company Name', value: 'BuildCore Elite' },
                  { label: 'Email', value: 'info@buildcoreelite.com' },
                  { label: 'Phone', value: '1-800-BUILD-01' },
                  { label: 'Address', value: '123 Construction Ave, City, State' },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-white/60 text-sm mb-2">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-full px-4 py-2 rounded-lg bg-elite-navy/50 border border-elite-blue/30 text-white focus:outline-none focus:border-elite-blue"
                    />
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-6">Save Changes</button>
            </div>

            <div className="glass rounded-xl p-6 border border-elite-blue/20">
              <h3 className="text-lg font-bold mb-4">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Change Admin Password</label>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-4 py-2 rounded-lg bg-elite-navy/50 border border-elite-blue/30 text-white placeholder-white/40 focus:outline-none focus:border-elite-blue"
                  />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-elite-blue/20">
              <h3 className="text-lg font-bold mb-4">Backups</h3>
              <p className="text-white/60 mb-4">Last backup: 2 hours ago</p>
              <button className="btn-secondary">Create Backup Now</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
