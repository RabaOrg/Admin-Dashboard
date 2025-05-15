import React, { useState } from 'react';
import { handleDeleteUpdate, handleUpdates } from '../../services/settings';
import { toast } from 'react-toastify';
import { useFetchGetUpdate } from '../../hooks/queries/settings';
import { useQueryClient } from '@tanstack/react-query'
export default function Settings() {
  const { data: getUpdate, isPending, isError } = useFetchGetUpdate();
  const [activeTab, setActiveTab] = useState('view');
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    platform: '',
    version: '',
    update_type: '',
    message: '',
    min_version: '',
    store_url: '',
    is_active: false,
  });
  const [response, setResponse] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await handleUpdates({
        platform: settings.platform || getUpdate?.data?.[0]?.platform,
        version: settings.version || getUpdate?.data?.[0]?.version,
        update_type: settings.update_type || getUpdate?.data?.[0]?.update_type,
        message: settings.message || getUpdate?.data?.[0]?.message,
        min_version: settings.min_version || getUpdate?.data?.[0]?.min_version,
        store_url: settings.store_url || getUpdate?.data?.[0]?.store_url,
        is_active: settings.is_active || getUpdate?.data?.[0]?.is_active,
      });
      if (res.data) {
        toast.success('Updates submitted successfully');
        setResponse(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit updates');
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await handleDeleteUpdate(id)
      if (response.data) {
        query.invalidateQueries({ queryKey: ["update"] })
        toast.success("Update deleted successfully")


      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin: App Update Settings</h1>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 -mb-px font-medium border-b-2 ${activeTab === 'view' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setActiveTab('view')}
          >
            View Updates
          </button>
          <button
            className={`ml-4 px-4 py-2 -mb-px font-medium border-b-2 ${activeTab === 'create' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setActiveTab('create')}
          >
            Create / Edit Update
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'view' && (
          <div>
            {isPending && <p>Loading updates...</p>}
            {isError && <p className="text-red-500">Failed to load updates.</p>}
            {!isPending && !isError && getUpdate?.data?.length > 0 ? (
              <div className="space-y-4">
                {getUpdate.data.map((u, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <p><strong>Platform:</strong> {u.platform}</p>
                    <p><strong>Version:</strong> {u.version}</p>
                    <p><strong>Min Version:</strong> {u.min_version}</p>
                    <p><strong>Type:</strong> {u.update_type}</p>
                    <p><strong>Message:</strong> {u.message}</p>
                    <p><strong>Store URL:</strong> <a href={u.store_url} className="text-indigo-600 underline" target="_blank" rel="noopener noreferrer">Link</a></p>
                    <p><strong>Active:</strong> {u.is_active ? 'Yes' : 'No'}</p>
                    <div className='mt-2'>
                      <button
                        type="submit"
                        className="bg-red-600 text-white px-2 text-sm py-2 rounded-lg hover:bg-red-700"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete Settings
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No updates available.</p>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Platform</label>
              <select
                name="platform"
                value={settings.platform || getUpdate?.data?.[0]?.platform}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-2"
              >
                <option value="">Select platform</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Version</label>
                <input
                  type="text"
                  name="version"
                  value={settings.version}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Min. Version</label>
                <input
                  type="text"
                  name="min_version"
                  value={settings.min_version}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-lg p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Update Type</label>
              <select
                name="update_type"
                value={settings.update_type}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-2"
              >
                <option value="">Select type</option>
                <option value="critical">Critical</option>
                <option value="moderate">Moderate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Update Message</label>
              <textarea
                name="message"
                value={settings.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Store URL</label>
              <input
                type="url"
                name="store_url"
                value={settings.store_url}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={settings.is_active}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label className="ml-2 text-sm font-medium">Active</label>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Save Settings
              </button>
              <button
                type="button"
                onClick={() => setSettings({
                  platform: '', version: '', update_type: '', message: '', min_version: '', store_url: '', is_active: false
                })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
