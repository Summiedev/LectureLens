import { Trash2 } from 'lucide-react';

export default function RecentSessions({ sessions = [], onClearHistory }) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Sessions</h2>
        <button
          className="text-sm text-gray-500 flex items-center gap-1 hover:text-black"
          onClick={onClearHistory}
        >
          Clear history <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {sessions.map((session, idx) => (
          <div
            key={idx}
            className={`w-72 rounded-xl border ${
              session.attention < 50 ? 'border-red-500' : 'border-green-500'
            } overflow-hidden bg-white shadow-sm`}
          >
            <div className="relative h-40">
              <img src={session.image || '/placeholder.png'} alt={session.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base">{session.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{new Date(session.date).toLocaleString()}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      session.attention < 50 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  />
                  <span className={`font-semibold ${
                    session.attention < 50 ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {session.attention.toFixed(1)}%
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {[...Array(Math.min(session.avatars, 5))].map((_, i) => (
                    <img
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      src={`https://randomuser.me/api/portraits/men/${i + 1}.jpg`}
                      alt=""
                    />
                  ))}
                  {session.avatars > 5 && (
                    <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center border-2 border-white">
                      +{session.avatars - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
