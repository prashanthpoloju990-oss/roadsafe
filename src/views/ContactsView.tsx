import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useProductState } from '../context/ProductStateContext';
import { useToast } from '../context/ToastContext';
import { EmergencyContact } from '../types';
import {
  Users,
  Plus,
  Phone,
  Edit2,
  Trash2,
  Check,
  Star,
  X,
  AlertCircle,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';

export const ContactsView: React.FC = () => {
  const {
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    setPrimaryEmergencyContact,
    removeEmergencyContact,
  } = useProductState();
  const { showToast } = useToast();

  // Modal State: null | 'add' | 'edit'
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirmation modal
  const [deletingContact, setDeletingContact] = useState<EmergencyContact | null>(null);

  // Separation of Primary vs Other contacts
  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];
  const otherContacts = emergencyContacts.filter(c => c.id !== primaryContact?.id);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      isPrimary: emergencyContacts.length === 0,
    });
    setFormErrors({});
    setModalMode('add');
    setEditingContactId(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      isPrimary: contact.isPrimary,
    });
    setFormErrors({});
    setEditingContactId(contact.id);
    setModalMode('edit');
  };

  // Form Validation & Save
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.relationship.trim()) errors.relationship = 'Relationship is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (modalMode === 'add') {
      addEmergencyContact({
        name: formData.name.trim(),
        relationship: formData.relationship.trim(),
        phone: formData.phone.trim(),
        isPrimary: formData.isPrimary,
      });
      showToast({
        type: 'success',
        title: 'Emergency Contact Added',
        message: `${formData.name} added to your trusted emergency circle.`,
      });
    } else if (modalMode === 'edit' && editingContactId) {
      updateEmergencyContact(editingContactId, {
        name: formData.name.trim(),
        relationship: formData.relationship.trim(),
        phone: formData.phone.trim(),
        isPrimary: formData.isPrimary,
      });
      showToast({
        type: 'success',
        title: 'Emergency Contact Updated',
        message: `Changes for ${formData.name} saved.`,
      });
    }

    setModalMode(null);
    setEditingContactId(null);
  };

  // Simulated Call action
  const handleCallContact = (contact: EmergencyContact) => {
    showToast({
      type: 'info',
      title: 'Connecting Voice Line',
      message: `Calling ${contact.name} (${contact.phone})...`,
    });
  };

  // Set Primary
  const handleMakePrimary = (id: string, name: string) => {
    setPrimaryEmergencyContact(id);
    showToast({
      type: 'success',
      title: 'Primary Contact Updated',
      message: `${name} is now your first-response contact.`,
    });
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deletingContact) return;
    const name = deletingContact.name;
    removeEmergencyContact(deletingContact.id);
    setDeletingContact(null);
    showToast({
      type: 'info',
      title: 'Contact Removed',
      message: `${name} removed from emergency dispatch circle.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto py-2 sm:py-6 space-y-8 sm:space-y-10 select-none"
    >
      {/* 1. Header */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider text-[#8A8D96] uppercase px-2.5 py-0.5 bg-white border border-[#E2E0D8]/70 rounded-full">
                {emergencyContacts.length} trusted {emergencyContacts.length === 1 ? 'contact' : 'contacts'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141517]">
              Emergency contacts
            </h1>
            <p className="text-sm sm:text-base text-[#585A62] leading-relaxed">
              People RoadSafe can notify when you need help.
            </p>
          </div>

          {/* Add contact action */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#141517] to-[#2A2B2F] hover:from-[#2A2B2F] hover:to-[#3A3B3F] text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add contact</span>
          </button>
        </div>

        {/* Mobile add contact action */}
        <div className="sm:hidden pt-1">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#141517] to-[#2A2B2F] text-white rounded-2xl text-sm font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add emergency contact</span>
          </button>
        </div>
      </section>

      {/* 2. Primary Contact Section */}
      {primaryContact && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
              Primary contact
            </h2>
            <span className="text-[11px] text-[#236E33] font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#236E33] text-[#236E33]" />
              <span>Notified First</span>
            </span>
          </div>

          <div className="relative bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#2B8A3E]/[0.04] pointer-events-none" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Avatar with initial */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF9F5] to-[#EDECE7] border border-[#E2E0D8]/70 flex items-center justify-center text-base font-bold text-[#141517] shrink-0">
                  {primaryContact.name.charAt(0)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#141517] tracking-tight">
                      {primaryContact.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#F2F9F3] text-[#236E33] border border-[#D2EED7] rounded-full font-semibold">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#585A62]">
                    {primaryContact.relationship} · <span className="font-mono tabular-nums text-[#141517] font-medium">{primaryContact.phone}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCallContact(primaryContact)}
                  className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-[#141517] hover:bg-[#FAF9F5] border border-[#E2E0D8]/70 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title={`Call ${primaryContact.name}`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#141517]" />
                  <span className="hidden sm:inline">Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(primaryContact)}
                  className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-[#585A62] hover:text-[#141517] hover:bg-[#FAF9F5] border border-[#E2E0D8]/70 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Edit contact"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>
            </div>

            {/* Explanatory note */}
            <div className="pt-2 border-t border-[#EDECE7]/80 flex items-center gap-2 text-xs text-[#8A8D96]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2B8A3E] shrink-0" />
              <span>Your primary contact is notified first when an emergency alert is sent.</span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Other Contacts Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8D96]">
            Trusted circle
          </h2>
          <span className="text-xs text-[#8A8D96]">
            {otherContacts.length} {otherContacts.length === 1 ? 'backup responder' : 'backup responders'}
          </span>
        </div>

        {otherContacts.length === 0 ? (
          <div className="p-10 text-center bg-white border border-[#E2E0D8]/70 rounded-2xl sm:rounded-3xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF9F5] flex items-center justify-center mx-auto">
              <Users className="w-7 h-7 text-[#8A8D96]" />
            </div>
            <p className="text-sm font-semibold text-[#141517]">No additional contacts</p>
            <p className="text-xs text-[#585A62] max-w-xs mx-auto">
              Add family members or close friends who can assist if your primary contact is unreachable.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {otherContacts.map(contact => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-white border border-[#E2E0D8]/70 rounded-2xl hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#EDECE7] flex items-center justify-center text-sm font-bold text-[#141517] shrink-0">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5 truncate">
                      <h4 className="text-sm sm:text-base font-semibold text-[#141517] truncate">
                        {contact.name}
                      </h4>
                      <p className="text-xs text-[#585A62] truncate">
                        {contact.relationship} · <span className="font-mono tabular-nums">{contact.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMakePrimary(contact.id, contact.name)}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#585A62] hover:text-[#141517] hover:bg-white border border-[#EDECE7] rounded-lg transition-colors cursor-pointer"
                      title="Set as primary contact"
                    >
                      <span>Set primary</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCallContact(contact)}
                      aria-label={`Call ${contact.name}`}
                      className="p-2 text-[#585A62] hover:text-[#141517] hover:bg-white border border-[#EDECE7] rounded-lg transition-colors cursor-pointer"
                      title={`Call ${contact.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(contact)}
                      aria-label={`Edit ${contact.name}`}
                      className="p-2 text-[#585A62] hover:text-[#141517] hover:bg-white border border-[#EDECE7] rounded-lg transition-colors cursor-pointer"
                      title="Edit contact"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingContact(contact)}
                      aria-label={`Delete ${contact.name}`}
                      className="p-2 text-[#8A8D96] hover:text-[#C92A2A] hover:bg-[#FDF2F2] border border-[#EDECE7] rounded-lg transition-colors cursor-pointer"
                      title="Delete contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 4. Add / Edit Contact Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EDECE7]">
                <h3 className="text-base sm:text-lg font-bold text-[#141517]">
                  {modalMode === 'add' ? 'Add emergency contact' : 'Edit emergency contact'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="p-1.5 text-[#8A8D96] hover:text-[#141517] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveContact} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Suresh Poloju"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] outline-none transition-colors"
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-[#C92A2A]">{formErrors.name}</p>
                  )}
                </div>

                {/* Relationship */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g. Father, Sister, Friend, Physician"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] outline-none transition-colors"
                  />
                  {formErrors.relationship && (
                    <p className="text-[11px] text-[#C92A2A]">{formErrors.relationship}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#141517] block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98490 54321"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2E0D8] focus:border-[#141517] rounded-xl text-sm text-[#141517] font-mono outline-none transition-colors"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-[#C92A2A]">{formErrors.phone}</p>
                  )}
                </div>

                {/* Set as Primary Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 bg-[#FAF9F5] border border-[#EDECE7] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={e => setFormData({ ...formData, isPrimary: e.target.checked })}
                      className="w-4 h-4 accent-[#141517] rounded cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-[#141517] block">
                        Set as primary emergency contact
                      </span>
                      <span className="text-[11px] text-[#585A62] block">
                        Will be broadcast to responders as first contact.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2.5 text-xs sm:text-sm font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#141517] hover:bg-[#2A2B2F] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    Save contact
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-[#E2E0D8] rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#FDF2F2] border border-[#F8D7DA] flex items-center justify-center text-[#C92A2A]">
                <AlertCircle className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#141517]">
                  Remove {deletingContact.name}?
                </h3>
                <p className="text-xs text-[#585A62] leading-relaxed">
                  This person will no longer receive automated emergency dispatches or location broadcasts.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingContact(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-[#585A62] hover:text-[#141517] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-[#C92A2A] hover:bg-[#B52525] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Remove contact
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
