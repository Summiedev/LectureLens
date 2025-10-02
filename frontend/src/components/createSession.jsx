import { UploadCloud, ArrowLeft, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DateTimePicker } from "./datepicker";
import { useState } from "react";
import { File } from "lucide-react";
import { handleFileUpload as uploadFile } from "../utils/db";
import { usePost } from "../hooks/api";
import { useAuthContext } from "../context/auth-context";
import { X } from "lucide-react";
import { useAppContext } from "../context/state";
import * as pdfjsLib from "pdfjs-dist";

export default function CreateSessionForm() {
  const { addMessage, updateMessage } = useAppContext();
  const [sessionDateTime, setSessionDateTime] = useState(null);
  const [sessionFormData, setSessionFormData] = useState({
    sessionName: "",
    sessionFile: undefined,
    aiGen: true,
  });
  const [text, setText] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const { loading, error, postData } = usePost();
  const { token } = useAuthContext();

  const navigate = useNavigate();

  const handleDateTimeChange = (dateTime) => {
    setSessionDateTime(dateTime);
  };

  const handleSessionNameChange = (e) => {
    setSessionFormData({
      ...sessionFormData,
      sessionName: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSessionFormData({
      ...sessionFormData,
      sessionFile: file,
    });
    extractText(file);
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!sessionFormData.sessionName.trim()) {
      setErrorMsg("Please enter a session name");
      return;
    }

    if (!sessionDateTime) {
      setErrorMsg("Please select a date and time for the session");
      return;
    }

    if (!sessionFormData.sessionFile) {
      setErrorMsg("Please upload a session file");
      return;
    }
    const msgId = new Date().getTime();
    setIsSubmitting(true);
    addMessage({
      id: msgId,
      message: "Uploading File...",
      state: "loading",
    });

    try {
      const fileUrl = await uploadFile(sessionFormData.sessionFile);
      setSessionFormData({ sessionName: "", sessionFile: "" });
      updateMessage(msgId, {
        message: "Creating Session...",
        state: "loading",
      });
      const data = await postData(
        "/sessions",
        {
          title: sessionFormData.sessionName,
          subject: sessionFormData.sessionName,
          dateTime: sessionDateTime,
          fileUrl,
        },
        token
      );
      const sessionId = data?.sessionId;
      updateMessage(msgId, {
        message: "Session Created Successfully!",
        state: "fulfilled",
      });
      if (sessionFormData.aiGen) {
        try {
          updateMessage(msgId, {
            message: "Generating Quiz with AI...",
            state: "loading",
          });
          const res = await postData(
            `/sessions/${sessionId}/questions`,
            { pdfText: JSON.stringify(text), aiGen: true },
            token
          );
          updateMessage(msgId, {
            message: "AI Questions Generated Successfully!",
            state: "fulfilled",
          });
        } catch (error) {
          updateMessage(msgId, {
            message: `Couldn't generate quiz with AI. Please try again later.`,
            state: "rejected",
          });
        }
      }
    } catch (err) {
      updateMessage(msgId, {
        message: `Error Creating session :${
          err.message || error?.message || "Failed to create session"
        }`,
        state: "rejected",
      });
      setErrorMsg(
        err.message ||
          error?.message ||
          "Failed to create session. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join("");
      text.push({ page: i, text: strings });
    }
    setText(text);
  };

  return (
    <div className="w-full max-w-4xl px-4 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <Link
        to={"/teacher-dashboard"}
        className="py-4 flex items-center gap-2 text-md text-gray-600 cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="bg-primary-50 ring-4 ring-primary-40/50 text-white py-4 px-6 rounded-lg flex flex-col items-start justify-center">
        <p className="text-xs font-medium">Teacher</p>
        <h2 className="text-lg font-semibold">Create session</h2>
      </div>

      <form className="p-6 space-y-6 relative" onSubmit={handleSubmit}>
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMsg}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
            Session Name
          </label>
          <input
            type="text"
            placeholder="Enter session name"
            value={sessionFormData.sessionName}
            onChange={handleSessionNameChange}
            className="w-full border rounded-md px-4 py-2 text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-start">
            Session Date & Time
          </label>
          <DateTimePicker onChange={handleDateTimeChange} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
            Upload Material
          </label>
          {sessionFormData.sessionFile ? (
            <div className="border border-dashed border-teal-300 p-3 text-start rounded-md relative flex gap-0.5 items-center justify-between">
              <div className="flex items-center gap-1">
                Selected File: <File className="size-4" />
                {sessionFormData.sessionFile.name}
              </div>
              <div
                onClick={() =>
                  !isSubmitting &&
                  setSessionFormData({
                    ...sessionFormData,
                    sessionFile: undefined,
                  })
                }
                className={`text-red-500 text-sm ${
                  isSubmitting
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <X />
              </div>
            </div>
          ) : (
            <div
              className={`border border-teal-300 p-6 rounded-md text-center relative ${
                isDragging
                  ? "border-2 border-teal-500 bg-teal-50"
                  : "border-dashed"
              }`}
              onDragEnter={() => !isSubmitting && setIsDragging(true)}
              onDragOver={() => !isSubmitting && setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
            >
              <input
                type="file"
                name="sessionFile"
                id="sessionFile"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex justify-center mb-2">
                <UploadCloud className="text-green-600 w-6 h-6" />
              </div>
              <p className="font-semibold text-gray-700">Upload file</p>
              <p className="text-sm text-gray-500 mb-4">
                Click to browse or drag & drop a file here
              </p>
              <button
                type="button"
                className="bg-green-400 text-white px-8 py-2 rounded-md hover:bg-green-500 transition pointer-events-none"
              >
                Upload
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <Lock className="w-4 h-4" />
          Create a session
        </button>
      </form>
    </div>
  );
}
