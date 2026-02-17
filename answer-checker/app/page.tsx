'use client';

import { useState } from 'react';
import { Loader2, Download, Award } from 'lucide-react';

interface EvaluationResult {
  totalMarks: number;
  obtainedMarks: number;
  reviewPdfUrl: string;
  studentName: string;
  subject: string;
}

export default function Page() {
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName || !subject || !file) {
      setError('Please fill all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('studentName', studentName);
    formData.append('subject', subject);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/evaluate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setResult({
        ...data,
        studentName,
        subject,
      });
    } catch {
      setError('Failed to evaluate paper');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Answer Paper Checker
        </h1>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Student Name"
              className="w-full border p-2 rounded"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border p-2 rounded"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <input
              type="file"
              accept=".pdf"
              className="w-full"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded flex justify-center items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Evaluate
                </>
              )}
            </button>

          </form>
        ) : (
          <div className="space-y-4">
            <p><strong>Name:</strong> {result.studentName}</p>
            <p><strong>Subject:</strong> {result.subject}</p>
            <p><strong>Total:</strong> {result.totalMarks}</p>
            <p><strong>Obtained:</strong> {result.obtainedMarks}</p>

            <button
              onClick={() => window.open(result.reviewPdfUrl)}
              className="bg-green-600 text-white p-2 rounded flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
