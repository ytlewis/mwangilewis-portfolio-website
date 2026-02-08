'use client';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface DashboardStatsProps {
  stats: {
    totalContacts: number;
    unreadContacts: number;
    recentContacts: Contact[];
  };
  isLoading: boolean;
}

export default function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-md p-3">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Contacts
                </dt>
                <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalContacts}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
              <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Unread Contacts
                </dt>
                <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                  {stats.unreadContacts}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Contacts
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recentContacts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No contacts yet
            </div>
          ) : (
            stats.recentContacts.map((contact) => (
              <div key={contact._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
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
      </div>
    </div>
  );
}