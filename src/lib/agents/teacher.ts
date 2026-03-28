/**
 * Teacher Agent - Handles narration and student interaction
 * Inspired by OpenMAIC's teacher persona
 */

import { AgentResponse, NarrationItem, StudentProfile, EmotionState, AGENT_CONFIGS } from './types';
import type { LessonSection } from '@/types';

// Tone adjustments based on student state
const EMOTION_ADJUSTMENTS: Record<EmotionState, { speedMultiplier: number; encouragementPrefix: string }> = {
  happy: { speedMultiplier: 1.0, encouragementPrefix: '' },
  neutral: { speedMultiplier: 1.0, encouragementPrefix: '' },
  anxious: { speedMultiplier: 0.9, encouragementPrefix: "Take your time. " },
  frustrated: { speedMultiplier: 0.85, encouragementPrefix: "Let's work through this together. " },
};

/**
 * Teacher Agent - Narrates lessons and provides encouragement
 */
export class TeacherAgent {
  private name: string;
  private personality: string;

  constructor() {
    const config = AGENT_CONFIGS.teacher;
    this.name = config.name;
    this.personality = config.personality;
  }

  /**
   * Generate narration for a lesson section
   */
  narrateSection(section: LessonSection, student: StudentProfile): AgentResponse {
    const adjustment = EMOTION_ADJUSTMENTS[student.emotion];
    const narration = section.narrationScript || this.generateNarrationFromContent(section);

    // Adjust narration based on emotion
    const adjustedText = adjustment.encouragementPrefix + narration;

    return {
      agentId: 'teacher',
      action: { type: 'NARRATE', text: adjustedText, emotion: 'calm' },
      narration: {
        agentId: 'teacher',
        text: adjustedText,
        emotion: student.emotion === 'frustrated' || student.emotion === 'anxious' ? 'calm' : 'excited',
      },
    };
  }

  /**
   * Introduce a new section with hook
   */
  introduceSection(section: LessonSection, sectionNumber: number, totalSections: number, student: StudentProfile): AgentResponse {
    const intro = this.generateSectionIntro(section, sectionNumber, totalSections);
    const adjustment = EMOTION_ADJUSTMENTS[student.emotion];

    return {
      agentId: 'teacher',
      action: { type: 'INTRODUCE_SECTION', section },
      narration: {
        agentId: 'teacher',
        text: adjustment.encouragementPrefix + intro,
        emotion: 'excited',
      },
    };
  }

  /**
   * Provide encouragement for correct/wrong answers
   */
  encourage(result: 'correct' | 'wrong', student: StudentProfile, attemptNumber: number = 1): AgentResponse {
    const messages = result === 'correct'
      ? this.getCorrectMessages(student, attemptNumber)
      : this.getWrongMessages(student, attemptNumber);

    return {
      agentId: 'teacher',
      action: { type: 'ENCOURAGE', reason: result },
      narration: {
        agentId: 'teacher',
        text: messages[Math.floor(Math.random() * messages.length)],
        emotion: result === 'correct' ? 'excited' : 'calm',
      },
    };
  }

  /**
   * Generate personalized welcome message
   */
  welcome(student: StudentProfile, lessonTitle: string): AgentResponse {
    const name = student.name || 'Explorer';
    const gradeContext = this.getGradeContext(student.grade);
    const emotion = student.emotion === 'happy' ? 'excited' : 'calm';

    const welcomeMessages = [
      `Hello, ${name}! I'm ${this.name}, and I'm so excited to explore ${lessonTitle} with you today! ${gradeContext}`,
      `Welcome, ${name}! Ready for an adventure in ${lessonTitle}? Let's dive in! ${gradeContext}`,
      `Great to see you, ${name}! Today we're going to discover something amazing about ${lessonTitle}. ${gradeContext}`,
    ];

    const adjustment = EMOTION_ADJUSTMENTS[student.emotion];
    const message = adjustment.encouragementPrefix + welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    return {
      agentId: 'teacher',
      action: { type: 'NARRATE', text: message, emotion },
      narration: {
        agentId: 'teacher',
        text: message,
        emotion,
      },
    };
  }

  /**
   * Generate transition between sections
   */
  transition(fromSection: LessonSection, toSection: LessonSection, student: StudentProfile): AgentResponse {
    const transitions = [
      `Great work on ${fromSection.heading}! Now let's explore ${toSection.heading}.`,
      `You've got ${fromSection.heading} down! Ready for ${toSection.heading}?`,
      `Excellent progress! Let's move on to ${toSection.heading}.`,
    ];

    const adjustment = EMOTION_ADJUSTMENTS[student.emotion];

    return {
      agentId: 'teacher',
      action: { type: 'NARRATE', text: transitions[0], emotion: 'calm' },
      narration: {
        agentId: 'teacher',
        text: adjustment.encouragementPrefix + transitions[Math.floor(Math.random() * transitions.length)],
        emotion: 'calm',
      },
    };
  }

  // --- Private helpers ---

  private generateNarrationFromContent(section: LessonSection): string {
    const points = section.keyPoints?.length
      ? section.keyPoints.slice(0, 3).join(', ')
      : section.content?.slice(0, 200) || '';

    return `${section.heading}. ${points}. ${section.activity || "Let's practice this together!"}`;
  }

  private generateSectionIntro(section: LessonSection, sectionNumber: number, totalSections: number): string {
    const progress = `Section ${sectionNumber} of ${totalSections}. `;
    return progress + (section.narrationScript || `Let's learn about ${section.heading}.`);
  }

  private getCorrectMessages(student: StudentProfile, attemptNumber: number): string[] {
    const name = student.name || 'there';
    const baseMessages = [
      `Excellent work, ${name}! That's exactly right!`,
      `You got it, ${name}! Well done!`,
      `Perfect, ${name}! You're really understanding this!`,
      `That's correct, ${name}! Keep up the great work!`,
      `Wonderful, ${name}! You're doing amazing!`,
    ];

    if (attemptNumber > 1) {
      return [
        `You got it this time, ${name}! Persistence pays off!`,
        `Great job sticking with it, ${name}! That's the spirit!`,
        `You worked through it, ${name}! That's how we learn!`,
      ];
    }

    return baseMessages;
  }

  private getWrongMessages(student: StudentProfile, attemptNumber: number): string[] {
    const name = student.name || 'there';

    if (student.emotion === 'frustrated' || student.emotion === 'anxious') {
      return [
        `It's okay, ${name}. Let me help you understand this better.`,
        `No worries, ${name}. Learning takes time. Let's try again together.`,
        `Take a breath, ${name}. This is tricky, but we'll figure it out.`,
      ];
    }

    if (attemptNumber >= 2) {
      return [
        `Let's break this down differently, ${name}.`,
        `Hmm, let me give you a better hint, ${name}.`,
        `Let's think about this step by step, ${name}.`,
      ];
    }

    return [
      `Not quite, ${name}, but you're on the right track! Try again.`,
      `Close, ${name}! Think about it from a different angle.`,
      `Almost there, ${name}! Let me give you a hint.`,
      `That's not it, ${name}, but don't give up!`,
    ];
  }

  private getGradeContext(grade: number): string {
    if (grade <= 4) {
      return "This is going to be so much fun!";
    } else if (grade <= 9) {
      return "Get ready for a challenge!";
    } else {
      return "Let's dive into some advanced concepts.";
    }
  }
}

// Singleton instance
let teacherInstance: TeacherAgent | null = null;

export function getTeacher(): TeacherAgent {
  if (!teacherInstance) {
    teacherInstance = new TeacherAgent();
  }
  return teacherInstance;
}