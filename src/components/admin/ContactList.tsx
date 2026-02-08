'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import ContactDetail from './ContactDetail';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  ipAddress?: string;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, [pagination.page]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/contacts?page=${pagination.page}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setPagination(data.pagination);
      } else {
        addToast({ message: 'Failed to load contacts', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      addToast({ message: 'Failed to load contacts', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (contactId: string, read: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read })
      });

      if (response.ok) {
        setContacts(contacts.map(c => 
          c._id === contactId ? { ...c, read } : c
        ));
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({ ...selectedContact, read });
        }
        addToast({ message: `Contact marked as ${read ? 'read' : 'unread'}`, type: 'success' });
      } else {
        addToast({ message: 'Failed to update contact', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
      addToast({ message: 'Failed to update contact', type: 'error' });
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c._id !== contactId));
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(null);
        }
        addToast({ message: 'Contact deleted successfully', type: 'success' });
      } else {
        addToast({ message: 'Failed to delete contact', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      addToast({ message: 'Failed to delete contact', type: 'error' });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            All Contacts ({pagination.total})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No contacts found
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className={`px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                  selectedContact?._id === contact._id ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </p>
                      {!contact.read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {contact.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                      {contact.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Contact Detail */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {selectedContact ? (
          <ContactDetail
            contact={selectedContact}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        ) : (
          <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            Select a contact to view details
          </div>
        )}
      </div>
    </div>
  );
}