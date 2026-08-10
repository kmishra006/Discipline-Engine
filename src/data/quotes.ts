export interface MotivationalQuote {
  id: number;
  text: string;
  theme: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  { id: 1, text: "Your future is being built by what you tolerate today.", theme: "Discipline" },
  { id: 2, text: "You don't need more time. You need fewer excuses.", theme: "Focus" },
  { id: 3, text: "The version of you that you want is built on days you don't feel like doing it.", theme: "Consistency" },
  { id: 4, text: "Nobody is coming to do the work for you.", theme: "Action" },
  { id: 5, text: "You can keep explaining why you failed, or start building why you won't.", theme: "Accountability" },
  { id: 6, text: "Comfort is expensive. You pay for it with potential.", theme: "Sacrifice" },
  { id: 7, text: "A year from now, you will wish you had started today.", theme: "Time" },
  { id: 8, text: "Disciplined execution outperforms raw talent every single day.", theme: "Execution" },
  { id: 9, text: "Small daily habits compound into unstoppable long-term mastery.", theme: "Habits" },
  { id: 10, text: "Pain of discipline weighs ounces. Pain of regret weighs tons.", theme: "Truth" },
  { id: 11, text: "Stop negotiating with yourself in the morning.", theme: "Focus" },
  { id: 12, text: "Your potential is a promise you owe to your future self.", theme: "Purpose" },
  { id: 13, text: "Action creates momentum; motivation is just a secondary byproduct.", theme: "Momentum" },
  { id: 14, text: "Distraction is the enemy of ambition.", theme: "Focus" },
  { id: 15, text: "Build systems that force success when willpower inevitably runs out.", theme: "Systems" },
  { id: 16, text: "Every hour spent in deep work is an investment no one can take from you.", theme: "Effort" },
  { id: 17, text: "Do not lower your goals to match your effort. Raise your effort to exceed your goals.", theme: "Standards" },
  { id: 18, text: "Excellence is not an accident; it is an unforgiving daily standard.", theme: "Mastery" },
  { id: 19, text: "The clock is ticking whether you are working or procrastinating.", theme: "Time" },
  { id: 20, text: "Prove your doubts wrong through undeniable proof of work.", theme: "Execution" },
  { id: 21, text: "Hard choices today yield an easy life tomorrow. Easy choices today yield a hard life tomorrow.", theme: "Perspective" },
  { id: 22, text: "Master your habits, master your mind, master your destiny.", theme: "Mastery" },
  { id: 23, text: "Silence the noise. Outwork your yesterday.", theme: "Grind" },
  { id: 24, text: "Consistency converts average talent into world-class capability.", theme: "Consistency" },
  { id: 25, text: "Your competition is resting while you are sharpening your mind.", theme: "Edge" }
];

export function getRandomQuote(): MotivationalQuote {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
}
