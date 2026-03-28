/**
 * Quiz Agent - Generates questions and provides feedback
 * Handles difficulty adaptation and personalized explanations
 */

import { AgentResponse, QuizQuestion, StudentProfile, EmotionState, AGENT_CONFIGS } from './types';

// Difficulty adjustments based on performance
const DIFFICULTY_PROGRESSION: Record<string, { next: 'easy' | 'medium' | 'hard'; prev: 'easy' | 'medium' | 'hard' }> = {
  easy: { next: 'medium', prev: 'easy' },
  medium: { next: 'hard', prev: 'easy' },
  hard: { next: 'hard', prev: 'medium' },
};

/**
 * Quiz Agent - Manages quiz questions and evaluation
 */
export class QuizAgent {
  private name: string;
  private questions: QuizQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private score: number = 0;
  private wrongAnswers: number[] = [];

  constructor() {
    const config = AGENT_CONFIGS.quiz;
    this.name = config.name;
  }

  /**
   * Initialize quiz with questions
   */
  initQuestions(questions: QuizQuestion[]): void {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.wrongAnswers = [];
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): QuizQuestion | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Get question with narration for TTS
   */
  presentQuestion(student: StudentProfile): AgentResponse {
    const question = this.getCurrentQuestion();
    if (!question) {
      return this.completeQuiz(student);
    }

    const questionNumber = this.currentQuestionIndex + 1;
    const totalQuestions = this.questions.length;

    const narrationText = this.formatQuestionForTTS(question, questionNumber, totalQuestions, student);

    return {
      agentId: 'quiz',
      action: { type: 'GENERATE_QUESTIONS', count: 1, difficulty: question.difficulty },
      narration: {
        agentId: 'quiz',
        text: narrationText,
        emotion: 'calm',
      },
    };
  }

  /**
   * Evaluate student answer
   */
  evaluateAnswer(answerIndex: number, student: StudentProfile): AgentResponse {
    const question = this.getCurrentQuestion();
    if (!question) {
      return this.completeQuiz(student);
    }

    const isCorrect = answerIndex === question.correctIndex;
    const questionNumber = this.currentQuestionIndex + 1;

    if (isCorrect) {
      this.score++;
    } else {
      this.wrongAnswers.push(this.currentQuestionIndex);
    }

    const feedbackText = isCorrect
      ? this.getCorrectFeedback(student, questionNumber)
      : this.getWrongFeedback(student, questionNumber, question);

    this.currentQuestionIndex++;

    return {
      agentId: 'quiz',
      action: { type: 'EVALUATE_ANSWER', questionIndex: this.currentQuestionIndex - 1, answer: answerIndex },
      narration: {
        agentId: 'quiz',
        text: feedbackText,
        emotion: isCorrect ? 'excited' : 'calm',
      },
    };
  }

  /**
   * Explain why an answer is wrong
   */
  explainWrongAnswer(questionIndex: number, student: StudentProfile): AgentResponse {
    if (questionIndex < 0 || questionIndex >= this.questions.length) {
      return this.completeQuiz(student);
    }

    const question = this.questions[questionIndex];
    const isCorrectIndex = question.correctIndex;

    const explanation = `${question.explanation} The correct answer was: "${question.options[isCorrectIndex]}".`;

    return {
      agentId: 'quiz',
      action: { type: 'EXPLAIN_WRONG', questionIndex },
      narration: {
        agentId: 'quiz',
        text: explanation,
        emotion: 'calm',
      },
    };
  }

  /**
   * Complete quiz and show results
   */
  completeQuiz(student: StudentProfile): AgentResponse {
    const totalQuestions = this.questions.length;
    const percentage = Math.round((this.score / totalQuestions) * 100);
    const name = student.name || 'Explorer';

    let resultText: string;
    let emotion: 'excited' | 'calm';

    if (percentage >= 80) {
      resultText = `Excellent work, ${name}! You scored ${this.score} out of ${totalQuestions}! That's ${percentage}%! You've really mastered this topic!`;
      emotion = 'excited';
    } else if (percentage >= 60) {
      resultText = `Good job, ${name}! You scored ${this.score} out of ${totalQuestions} (${percentage}%). You're making great progress!`;
      emotion = 'excited';
    } else if (percentage >= 40) {
      resultText = `You scored ${this.score} out of ${totalQuestions}, ${name}. Keep practicing and you'll improve!`;
      emotion = 'calm';
    } else {
      resultText = `You scored ${this.score} out of ${totalQuestions}, ${name}. Don't worry - learning takes time. Let's review and try again!`;
      emotion = 'calm';
    }

    // Add hints about which questions were wrong
    if (this.wrongAnswers.length > 0 && this.wrongAnswers.length < totalQuestions) {
      const wrongNumbers = this.wrongAnswers.map(i => i + 1).join(', ');
      resultText += ` Questions ${wrongNumbers} could use some more practice.`;
    }

    return {
      agentId: 'quiz',
      action: { type: 'EVALUATE_ANSWER', questionIndex: -1, answer: -1 },
      narration: {
        agentId: 'quiz',
        text: resultText,
        emotion,
      },
    };
  }

  /**
   * Get current progress
   */
  getProgress(): { current: number; total: number; score: number } {
    return {
      current: this.currentQuestionIndex,
      total: this.questions.length,
      score: this.score,
    };
  }

  /**
   * Get recommended difficulty for next question
   */
  getRecommendedDifficulty(): 'easy' | 'medium' | 'hard' {
    if (this.questions.length === 0) return 'medium';

    const currentDifficulty = this.questions[this.currentQuestionIndex]?.difficulty || 'medium';

    // If doing well, increase difficulty
    if (this.score > this.currentQuestionIndex / 2) {
      return DIFFICULTY_PROGRESSION[currentDifficulty].next;
    }

    // If struggling, decrease difficulty
    return DIFFICULTY_PROGRESSION[currentDifficulty].prev;
  }

  /**
   * Reset quiz state
   */
  reset(): void {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.wrongAnswers = [];
  }

  // --- Private helpers ---

  private formatQuestionForTTS(
    question: QuizQuestion,
    questionNumber: number,
    totalQuestions: number,
    student: StudentProfile
  ): string {
    const name = student.name || 'there';
    const options = question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('. ');

    let text = `Question ${questionNumber} of ${totalQuestions}. ${question.question}. Your options are: ${options}.`;

    // Add emotion-based encouragement
    if (student.emotion === 'anxious' || student.emotion === 'frustrated') {
      text = `Take your time, ${name}. ${text} Think carefully and choose what you believe is correct.`;
    }

    return text;
  }

  private getCorrectFeedback(student: StudentProfile, questionNumber: number): string {
    const name = student.name || 'there';
    const messages = [
      `That's correct, ${name}! Great work!`,
      `Perfect answer, ${name}! You're really understanding this!`,
      `Excellent, ${name}! That's ${questionNumber} down!`,
      `Right answer, ${name}! Keep it up!`,
      `You got it, ${name}! Well done!`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getWrongFeedback(student: StudentProfile, questionNumber: number, question: QuizQuestion): string {
    const name = student.name || 'there';
    const correctAnswer = question.options[question.correctIndex];

    if (student.emotion === 'frustrated' || student.emotion === 'anxious') {
      return `That's not quite right, ${name}, but that's okay! The correct answer was "${correctAnswer}". ${question.explanation}`;
    }

    const messages = [
      `Not quite, ${name}. The correct answer was "${correctAnswer}". ${question.explanation}`,
      `Close, ${name}! The right answer is "${correctAnswer}". ${question.explanation}`,
      `That's incorrect, ${name}, but good effort! "${correctAnswer}" was the answer. ${question.explanation}`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// Singleton instance
let quizInstance: QuizAgent | null = null;

export function getQuiz(): QuizAgent {
  if (!quizInstance) {
    quizInstance = new QuizAgent();
  }
  return quizInstance;
}

export function resetQuiz(): void {
  quizInstance = null;
}