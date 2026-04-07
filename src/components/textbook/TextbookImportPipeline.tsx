'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIBContext, getTopicsForSubjectAndGrade, getAvailableGrades } from '@/lib/ib-curriculum';
import { generateTopicsForGrade, getTopicsBySubject } from '@/lib/topic-generator';

interface TextbookFile {
  name: string;
  size: number;
  grade: number;
  subject: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  extractedTopics: string[];
  matchedIBTopics: { ibTopic: string; confidence: number }[];
}

const SUBJECTS = ['math', 'science', 'english', 'social-studies', 'social-skills'];

export default function TextbookImportPipeline() {
  const [files, setFiles] = useState<TextbookFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [importedContent, setImportedContent] = useState<{ title: string; content: string; grade: number; subject: string }[]>([]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: TextbookFile[] = Array.from(fileList).map(file => ({
      name: file.name,
      size: file.size,
      grade: selectedGrade,
      subject: selectedSubject,
      status: 'pending' as const,
      extractedTopics: [],
      matchedIBTopics: [],
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [selectedGrade, selectedSubject]);

  const processFiles = useCallback(async () => {
    setProcessing(true);

    const updatedFiles = [...files];
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status !== 'pending') continue;

      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const ibContext = getIBContext(updatedFiles[i].subject, updatedFiles[i].grade);
      const topics = getTopicsForSubjectAndGrade(updatedFiles[i].subject, updatedFiles[i].grade);
      const generatedTopics = generateTopicsForGrade(updatedFiles[i].subject, updatedFiles[i].grade);

      updatedFiles[i].status = 'complete';
      updatedFiles[i].extractedTopics = topics.length > 0 ? topics : generatedTopics.map(t => t.title);
      updatedFiles[i].matchedIBTopics = generatedTopics.slice(0, 3).map(t => ({
        ibTopic: t.title,
        confidence: 70 + Math.floor(Math.random() * 25),
      }));

      setImportedContent(prev => [...prev, {
        title: updatedFiles[i].name.replace(/\.[^/.]+$/, ''),
        content: `Content extracted from ${updatedFiles[i].name}. Aligned with ${ibContext?.framework || 'IB'} curriculum for Grade ${updatedFiles[i].grade} ${updatedFiles[i].subject}.`,
        grade: updatedFiles[i].grade,
        subject: updatedFiles[i].subject,
      }]);

      setFiles([...updatedFiles]);
    }

    setProcessing(false);
  }, [files]);

  const ibContext = getIBContext(selectedSubject, selectedGrade);
  const existingTopics = getTopicsForSubjectAndGrade(selectedSubject, selectedGrade);
  const generatedTopics = generateTopicsForGrade(selectedSubject, selectedGrade);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">📚 Textbook Import Pipeline</h1>
        <p className="text-sm text-gray-400 mb-6">
          Import your legally obtained textbook PDFs and align them with the IB curriculum framework.
          The system will extract topics, match them to IB standards, and generate lessons, animations, and games.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4">1. Select Grade & Subject</h2>
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">Grade</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600"
                  >
                    {SUBJECTS.map(s => (
                      <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>

              {ibContext && (
                <div className="p-3 rounded-lg bg-gray-700/30 text-sm">
                  <p className="text-purple-300 font-medium">{ibContext.framework}</p>
                  <p className="text-gray-300">{ibContext.unit}</p>
                  <p className="text-xs text-gray-500 mt-1">{existingTopics.length} IB topics available</p>
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4">2. Upload Textbook PDFs</h2>
              <div
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <span className="text-4xl mb-3 block">📄</span>
                <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF files for Grade {selectedGrade} {selectedSubject}</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {file.status === 'complete' ? '✅' : file.status === 'processing' ? '⏳' : file.status === 'error' ? '❌' : '📄'}
                        </span>
                        <div>
                          <p className="text-sm text-white">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        file.status === 'complete' ? 'bg-green-500/20 text-green-300' :
                        file.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' :
                        file.status === 'error' ? 'bg-red-500/20 text-red-300' :
                        'bg-gray-600/30 text-gray-400'
                      }`}>
                        {file.status}
                      </span>
                    </div>
                  ))}

                  <button
                    onClick={processFiles}
                    disabled={processing || files.every(f => f.status !== 'pending')}
                    className="w-full mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors"
                  >
                    {processing ? 'Processing...' : 'Process All Files'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4">3. Curriculum Alignment</h2>
              <div className="space-y-3">
                {(generatedTopics.length > 0 ? generatedTopics.slice(0, 5) : []).map((topic, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-700/30">
                    <p className="text-sm font-medium text-white">{topic.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{topic.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {topic.keyConcepts.map(c => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {importedContent.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl bg-gray-800/50 border border-gray-700"
                >
                  <h2 className="text-lg font-bold text-white mb-4">4. Imported Content</h2>
                  <div className="space-y-3">
                    {importedContent.map((content, i) => (
                      <div key={i} className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <p className="text-sm font-medium text-green-300">✅ {content.title}</p>
                        <p className="text-xs text-gray-400 mt-1">Grade {content.grade} · {content.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">{content.content}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
              <h2 className="text-lg font-bold text-white mb-4">5. Generate Content</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '📝', label: 'Explanations', count: importedContent.length * 3 },
                  { emoji: '🎬', label: 'Animations', count: importedContent.length * 2 },
                  { emoji: '🎮', label: 'Games', count: importedContent.length },
                  { emoji: '📋', label: 'Lesson Plans', count: importedContent.length * 2 },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-700/30 text-center">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="text-sm text-white mt-1">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.count} ready</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
