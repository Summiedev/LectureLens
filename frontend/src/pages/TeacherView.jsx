import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/footer';

export default function TeacherViewSession() {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <>
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button className="text-blue-600 font-bold text-xl">←</button>
          <div>
            <h1 className="text-2xl font-semibold">Histology of the Gallbladder</h1>
            <p className="text-sm text-gray-500">June 12th, 2022 | 11:00 AM</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`}
                  alt="student"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center border-2 border-white">
                +200
              </div>
            </div>
            <input
              value="uxv-xyz-mno"
              readOnly
              className="bg-gray-100 px-4 py-1 rounded-md text-sm border border-gray-300"
            />
          </div>
        </div>

        <div className="bg-black rounded-lg overflow-hidden">
          <img
            src="/gallbladder-diagram.png"
            alt="Diagram"
            className="w-full h-auto object-cover"
          />
          <div className="text-white text-center bg-red-600 py-2 cursor-pointer font-semibold">
            End session
          </div>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto">
          {[{
            img: '/attention1.png',
            label: 'Average Attention',
            value: '22.8%',
            textColor: 'text-red-600',
            border: ''
          }, {
            img: '/attention2.png',
            label: 'Average Attention',
            value: '72.8%',
            textColor: 'text-green-600',
            border: ''
          }, {
            img: '/attention3.png',
            label: 'Average Attention',
            value: '',
            textColor: 'text-gray-600',
            border: 'border-2 border-blue-600'
          }].map((card, i) => (
            <div
              key={i}
              className={`min-w-[300px] relative rounded-lg overflow-hidden bg-white ${card.border}`}
            >
              <img src={card.img} className="w-full h-40 object-cover opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80">
                <div className={`text-sm font-medium ${card.textColor}`}>{card.label}</div>
                {card.value && (
                  <div className={`font-bold ${card.textColor}`}>{card.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex mb-4 border rounded-lg overflow-hidden">
            <button
              className={`w-full py-2 text-center ${activeTab === 'students' ? 'bg-white font-semibold' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
            <button
              className={`w-full py-2 text-center ${activeTab === 'quizzes' ? 'bg-white font-semibold' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </button>
          </div>

          {activeTab === 'students' && (
            <div className="space-y-3">
              {[10, 11].map((num, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={`https://randomuser.me/api/portraits/women/${num}.jpg`} className="w-8 h-8 rounded-full" />
                  <p className="font-medium">Laila Oreoluwa</p>
                  <span className="ml-auto text-blue-600 font-semibold">9 points</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="text-gray-500 text-sm">No quiz data available.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
