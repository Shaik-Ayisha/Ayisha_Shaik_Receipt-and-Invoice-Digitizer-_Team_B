import Sidebar from "../components/Sidebar";

export default function PrivacyPolicy() {

  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="fixed w-64 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-8">

        <h1 className="text-3xl font-bold mb-6">
          Privacy Policy
        </h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <p>
            We value your privacy. All uploaded invoices and receipts are securely processed
            using OCR technology and stored safely.
          </p>

          <p>
            Your data is not shared with third parties. All extracted information is used
            only for analytics and document management.
          </p>

          <p>
            Uploaded files are stored securely and can be deleted by the user or admin at any time.
          </p>

          <p>
            We implement security measures to protect your data from unauthorized access.
          </p>

          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

        </div>

      </div>

    </div>
  );
}