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
          background: '#ffffff',
          border: '1px solid #e2e8f0',
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
                background: '#fff7ed',
                border: '1px solid #ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c'
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ea580c', fontFamily: 'var(--font-heading)' }}>
                Restaurant Staff Database
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Shared Workspace: <span style={{ color: '#ea580c', fontWeight: 700 }}>{restaurant?.name}</span> (ID: {restaurant?.id})
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)'
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
              background: '#fffbe8',
              border: '1px solid #fde68a',
              color: '#b45309',
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
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            fontSize: '0.85rem',
            fontWeight: 600,
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
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.85rem',
            fontWeight: 600,
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
          background: '#ffffff',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c' }}>
            Authorized Personnel ({staffList.length})
          </h3>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            All personnel access the same <strong style={{ color: '#0f172a' }}>{restaurant?.name}</strong> inventory
          </div>
        </div>

        {/* Desktop Table View */}
        <div style={{ overflowX: 'auto' }} className="desktop-staff-table">
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 8px',
              fontSize: '0.88rem'
            }}
          >
            <thead>
              <tr style={{ color: '#64748b', textAlign: 'left', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                      background: isCurrentUser ? '#fff7ed' : '#f8fafc',
                      borderRadius: '14px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{member.name}</span>
                        {isCurrentUser && (
                          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', border: '1px solid #ea580c', fontWeight: 700 }}>
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
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={12} color="#64748b" /> {member.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} color="#64748b" /> {member.phone}
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
                          fontWeight: 700,
                          color: member.status === 'active' ? '#047857' : '#64748b',
                          background: member.status === 'active' ? '#ecfdf5' : '#f1f5f9'
                        }}
                      >
                        ● {member.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Created At */}
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem' }}>
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
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#b91c1c',
                              fontWeight: 700,
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
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Protected</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="mobile-staff-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
          {staffList.map((member) => {
            const roleConfig = getRoleBadgeConfig(member.role);
            const isCurrentUser = member.id === user?.id;

            return (
              <div
                key={member.id}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: isCurrentUser ? '#fff7ed' : '#ffffff',
                  border: isCurrentUser ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{member.name}</span>
                    {isCurrentUser && (
                      <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '8px', background: '#fff7ed', color: '#ea580c', fontWeight: 700 }}>You</span>
                    )}
                  </div>

                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: roleConfig.color,
                      background: roleConfig.bg,
                      border: `1px solid ${roleConfig.border}`
                    }}
                  >
                    {roleConfig.label}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={13} color="#64748b" /> {member.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={13} color="#64748b" /> {member.phone}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Joined {new Date(member.createdAt).toLocaleDateString()}
                  </span>

                  {canManage && !isCurrentUser && member.role !== 'owner' && (
                    <button
                      onClick={() => handleDeleteStaff(member)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .desktop-staff-table { display: none !important; }
            .mobile-staff-cards { display: flex !important; }
          }
        `}</style>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.4)',
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
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={20} color="#ea580c" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ea580c' }}>
                  Add New Staff Member
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
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
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
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
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
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
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Staff Role *
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffRole })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="manager" style={{ background: '#ffffff', color: '#0f172a' }}>Manager (Full operational access)</option>
                  <option value="chef" style={{ background: '#ffffff', color: '#0f172a' }}>Chef (Kitchen, Cooking & AI access)</option>
                  <option value="inventory_staff" style={{ background: '#ffffff', color: '#0f172a' }}>Inventory Staff (Stock & AI access)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
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
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    color: '#0f172a',
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
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    fontWeight: 600,
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
                    background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
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
