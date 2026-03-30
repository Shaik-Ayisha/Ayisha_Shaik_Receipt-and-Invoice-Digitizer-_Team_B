import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Settings() {

  const [fileSize, setFileSize] = useState(5);
  const [autoDelete, setAutoDelete] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="fixed w-64 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8">

        <h1 className="text-3xl font-bold mb-6">
          Settings
        </h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-6">

          {/* File Upload Limit */}
          <div>
            <label className="block font-medium mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              className="border p-2 rounded w-32"
            />
          </div>

          {/* Auto Delete */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={autoDelete}
              onChange={() => setAutoDelete(!autoDelete)}
            />
            <span>Auto delete files after 30 days</span>
          </div>

          {/* Save Button */}
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Save Settings
          </button>

        </div>

      </div>

    </div>
  );
}