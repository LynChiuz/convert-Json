import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, FileJson2, CheckCircle, XCircle } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuestionsViewerProps {
  documentId: string;
}

export default function QuestionsViewer({ documentId }: QuestionsViewerProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery<{ questions: Question[]; count: number }>({
    queryKey: ['/api/documents', documentId, 'questions'],
    enabled: !!documentId,
  });

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileJson2 className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Extracted Questions</h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.questions) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileJson2 className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Extracted Questions</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FileJson2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No questions found in this document</p>
        </div>
      </div>
    );
  }

  const questions: Question[] = data.questions;

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileJson2 className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Extracted Questions</h3>
          </div>
          <div className="text-sm text-gray-500">
            {questions.length} question{questions.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {questions.map((question, index) => (
          <div key={index} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              data-testid={`question-toggle-${index}`}
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">
                  Question {index + 1}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {question.question}
                </p>
              </div>
              {expandedQuestions.has(index) ? (
                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              )}
            </button>

            {expandedQuestions.has(index) && (
              <div className="px-6 pb-6 space-y-4" data-testid={`question-content-${index}`}>
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question:</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800">
                    {question.question}
                  </div>
                </div>

                {/* Answers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answers:</label>
                  <div className="space-y-2">
                    {question.answers.map((answer, answerIndex) => (
                      <div
                        key={answerIndex}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          answer.isCorrect
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        data-testid={`answer-${index}-${answerIndex}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {answer.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">
                            {String.fromCharCode(97 + answerIndex)}.
                          </div>
                          <div className="text-sm text-gray-800">
                            {answer.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                {question.correctAnswer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer:</label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm text-green-800 font-medium">
                        {question.correctAnswer}
                      </div>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {question.explain && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation:</label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-800">
                        {question.explain}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reference */}
                {question.reference && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference:</label>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="text-sm text-purple-800">
                        {question.reference}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}