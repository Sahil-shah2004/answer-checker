"use client";

import { useState } from "react";
import { Loader2, Award } from "lucide-react";

interface EvaluationResult {
  totalMarks: number;
  obtainedMarks: number;
  reviewPdfUrl?: string;
}

export default function Page() {
  const [studentName, setStudentName] = useState("");
  const [subject, setSubject] = useState("");
  const [answerScript, setAnswerScript] = useState<File | null>(null);
  const [solutionSet, setSolutionSet] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName || !subject || !answerScript || !solutionSet) {
      setError("Please fill all fields and upload both PDFs.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("subject", subject);
    formData.append("answerScript", answerScript);
    formData.append("solutionSet", solutionSet);

    try {
      const response = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend not responding");
      }

      const data = await response.json();
      setResult(data);

    } catch {
      setError(
        "Cannot connect to backend server. Please ensure backend is running on port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-6">

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Answer Paper Checker
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Student Name *
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Subject *
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Answer Script PDF *
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setAnswerScript(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Solution Set PDF *
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSolutionSet(e.target.files?.[0] || null)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting to Backend...
              </>
            ) : (
              <>
                <Award className="w-5 h-5" />
                Evaluate Paper
              </>
            )}
          </button>

        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <p><strong>Total Marks:</strong> {result.totalMarks}</p>
            <p><strong>Obtained Marks:</strong> {result.obtainedMarks}</p>
          </div>
        )}

      </div>
    </div>
  );
}
