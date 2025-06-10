import { useState } from "react";
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/footer";

export default function TeacherViewSession() {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <>
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button className="text-blue-600 font-bold text-xl">←</button>
          <div>
            <h1 className="text-2xl font-semibold">
              Histology of the Gallbladder
            </h1>
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
          <Card className="min-w-[300px] relative">
            <img src="/attention1.png" className="w-full h-40 object-cover" />
            <CardContent className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80">
              <div className="text-sm font-medium text-red-600">
                Average Attention
              </div>
              <div className="font-bold text-red-600">22.8%</div>
            </CardContent>
          </Card>

          <Card className="min-w-[300px] relative">
            <img src="/attention2.png" className="w-full h-40 object-cover" />
            <CardContent className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80">
              <div className="text-sm font-medium text-green-600">
                Average Attention
              </div>
              <div className="font-bold text-green-600">72.8%</div>
            </CardContent>
          </Card>

          <Card className="min-w-[300px] relative border-2 border-blue-600">
            <img
              src="/attention3.png"
              className="w-full h-40 object-cover opacity-80"
            />
            <CardContent className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80">
              <div className="text-sm font-medium text-gray-600">
                Average Attention
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white border rounded-lg w-full flex mb-4">
              <TabsTrigger value="students" className="w-full py-2">
                Students
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="w-full py-2">
                Quizzes
              </TabsTrigger>
            </TabsList>

            {activeTab === "students" && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/10.jpg"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-medium">Laila Oreoluwa</p>
                  <span className="ml-auto text-blue-600 font-semibold">
                    9 points
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/11.jpg"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-medium">Laila Oreoluwa</p>
                  <span className="ml-auto text-blue-600 font-semibold">
                    9 points
                  </span>
                </div>
              </div>
            )}
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
