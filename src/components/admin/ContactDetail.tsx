'use client';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  ipAddress?: string;
}

interface ContactDetailProps {
  contact: Contact;
  onMarkAsRead: (contactId: string, read: boolean) => void;
  onDelete: (contactId: string) => void;
}

export default function ContactDetail({ contact, onMarkAsRead, onDelete }: ContactDetailProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Contact Details
        </h3>
      </div>

      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <p className="text-base text-gray-900 dark:text-white">
            {contact.name}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <a
            href={`mailto:${contact.email}`}
            className="text-base text-red-600 dark:text-red-400 hover:underline"
          >
            {contact.email}
          </a>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
            <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap">
              {contact.message}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Submitted
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(contact.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              contact.read
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {contact.read ? 'Read' : 'Unread'}
            </span>
          </div>
        </div>

        {contact.ipAddress && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IP Address
            </label>
            <p className="text-sm text-gray-900 dark:text-white font-mono">
              {contact.ipAddress}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
        <button
          onClick={() => onMarkAsRead(contact._id, !contact.read)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Mark as {contact.read ? 'Unread' : 'Read'}
        </button>
        <button
          onClick={() => onDelete(contact._id)}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}