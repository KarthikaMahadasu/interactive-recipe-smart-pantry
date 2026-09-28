import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBadgeConfig } from '../utils/permissions';
import type { StaffRole, User } from '../types/auth';
import { Users, UserPlus, Shield, Mail, Phone, Calendar, Trash2, CheckCircle, AlertCircle, X, Lock } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { user, restaurant, getStaff, addStaff, deleteStaff, hasPermission } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add Staff Form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'chef' as StaffRole,
    password: 'password123'
  });

  const staffList = getStaff();
  const canManage = hasPermission('manage_staff');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const created = addStaff(newStaff);
      setSuccess(`Successfully added staff member "${created.name}" as ${created.role.toUpperCase()}`);
      setShowAddModal(false);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        role: 'chef',
        password: 'password123'
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
    }
  };

  const handleDeleteStaff = (staffMember: User) => {
    if (!window.confirm(`Are you sure you want to remove "${staffMember.name}" from ${restaurant?.name}?`)) {
      return;
    }

    try {
      deleteStaff(staffMember.id);
      setSuccess(`Removed ${staffMember.name} from staff list.`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete staff member');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc'
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                Restaurant Staff Database
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Shared Workspace: <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{restaurant?.name}</span> (ID: {restaurant?.id})
              </p>
            </div>
          </div>
        </div>

        {canManage ? (
          <button
            onClick={() => {
              setError(null);
              setSuccess(null);
              setShowAddModal(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
            }}
          >
            <UserPlus size={18} />
            <span>Add Staff Member</span>
          </button>
        ) : (
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fcd34d',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Lock size={14} /> View-Only Access ({user?.role?.toUpperCase()})
          </div>
        )}
      </div>

      {/* Success Notification */}
      {success && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Staff Grid/Table */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Authorized Personnel ({staffList.length})
          </h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            All personnel access the same <strong style={{ color: '#fff' }}>{restaurant?.name}</strong> inventory
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 8px',
              fontSize: '0.88rem'
            }}
          >
            <thead>
              <tr style={{ color: 'var(--text-dim)', textAlign: 'left', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '8px 16px' }}>Staff Name</th>
                <th style={{ padding: '8px 16px' }}>Role</th>
                <th style={{ padding: '8px 16px' }}>Contact Info</th>
                <th style={{ padding: '8px 16px' }}>Status</th>
                <th style={{ padding: '8px 16px' }}>Joined Date</th>
                {canManage && <th style={{ padding: '8px 16px', textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {staffList.map((member) => {
                const roleConfig = getRoleBadgeConfig(member.role);
                const isCurrentUser = member.id === user?.id;

                return (
                  <tr
                    key={member.id}
                    style={{
                      background: isCurrentUser ? 'rgba(6, 182, 212, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                      borderRadius: '14px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-main)', borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{member.name}</span>
                        {isCurrentUser && (
                          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--primary-cyan)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: roleConfig.color,
                          background: roleConfig.bg,
                          border: `1px solid ${roleConfig.border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Shield size={12} /> {roleConfig.label}
                      </span>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={12} color="var(--text-dim)" /> {member.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} color="var(--text-dim)" /> {member.phone}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: member.status === 'active' ? '#34d399' : '#94a3b8',
                          background: member.status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)'
                        }}
                      >
                        ● {member.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Created At */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={13} /> {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}
                    {canManage && (
                      <td style={{ padding: '14px 16px', textAlign: 'right', borderTopRightRadius: '14px', borderBottomRightRadius: '14px' }}>
                        {!isCurrentUser && member.role !== 'owner' ? (
                          <button
                            onClick={() => handleDeleteStaff(member)}
                            title="Remove staff member"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '10px',
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#fca5a5',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem'
                            }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Protected</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(8, 12, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '30px',
              borderRadius: '24px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={20} color="var(--primary-cyan)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Add New Staff Member
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="staff@spicegarden.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="+1 (555) 000-1111"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Staff Role *
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffRole })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="manager">Manager (Full operational access)</option>
                  <option value="chef">Chef (Kitchen, Cooking & AI access)</option>
                  <option value="inventory_staff">Inventory Staff (Stock & AI access)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Initial Login Password *
                </label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="password123"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'rgba(148, 163, 184, 0.15)',
                    color: '#94a3b8',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    background: 'var(--primary-cyan)',
                    color: '#000',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
