import { UploadCloud, ArrowLeft, Lock } from 'lucide-react';

export default function CreateSessionForm() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back
      </div>

      <div className="bg-orange-500 text-white py-4 px-6 rounded-t-lg">
        <p className="text-xs font-medium">Teacher</p>
        <h2 className="text-lg font-semibold">Create session</h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
          <input
            type="text"
            defaultValue="John Doe"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Duration</label>
          <input
            type="email"
            defaultValue="Johndoe@gmail.com"
            className="w-full border rounded-md px-4 py-2 bg-gray-100 text-gray-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Material</label>
          <div className="border border-dashed border-teal-300 p-6 rounded-md text-center">
            <div className="flex justify-center mb-2">
              <UploadCloud className="text-green-600 w-6 h-6" />
            </div>
            <p className="font-semibold text-gray-700">Upload file</p>
            <p className="text-sm text-gray-500 mb-4">Click to browse or drag & drop a file here</p>
            <button className="bg-green-400 text-white px-8 py-2 rounded-md hover:bg-green-500 transition">
              Upload
            </button>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-md flex justify-center items-center gap-2 hover:bg-blue-700 transition">
          <Lock className="w-4 h-4" />
          Create a session
        </button>
      </div>
    </div>
  );
}
