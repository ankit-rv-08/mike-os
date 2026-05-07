// voice-service.js - JARVIS-style voice processing for MIKE OS

async function processVoice({ transcript, parser }) {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('No transcript provided');
  }
  
  const cleaned = transcript.trim();
  const detectedCommand = detectVoiceCommand(cleaned);
  const result = await parser(cleaned);
  const response = generateJarvisResponse(detectedCommand, result);
  
  return {
    original: transcript,
    cleaned,
    command: detectedCommand,
    result,
    response,
    timestamp: new Date().toISOString()
  };
}

function detectVoiceCommand(transcript) {
  const lower = transcript.toLowerCase();
  
  const commands = {
    file_open: ['open file', 'read file', 'show file', 'open the file'],
    task_create: ['create task', 'add task', 'new task', 'make a task'],
    stocks_check: ['check stocks', 'stock market', 'stock price', 'how is the market'],
    web_search: ['what is', 'who is', 'search for', 'look up', 'tell me about'],
    github_info: ['show github', 'github info', 'my repos', 'repository'],
    file_list: ['list files', 'show files', 'what files', 'project files'],
    reminder_add: ['add reminder', 'remind me', 'set reminder', 'reminder'],
    life_score: ['life score', 'how am i doing', 'my performance', 'daily score'],
    greeting_morning: ['good morning', 'morning'],
    greeting_night: ['good night', 'goodnight'],
    gratitude: ['thank you', 'thanks'],
    time_check: ['what time', 'current time', 'what day'],
    weather: ['weather', 'temperature', 'how hot', 'how cold']
  };
  
  for (const [action, phrases] of Object.entries(commands)) {
    if (phrases.some(phrase => lower.includes(phrase))) {
      return { action, phrase: phrases.find(p => lower.includes(p)) };
    }
  }
  
  return { action: 'general_query', phrase: null };
}

function generateJarvisResponse(command, result) {
  const hour = new Date().getHours();
  
  const responses = {
    file_open: [
      "Right away, Ankith. Accessing the file now.",
      "Certainly. Pulling up that file for you.",
      "File access granted. Here's what I found."
    ],
    task_create: [
      "Task created and logged. Consider it done.",
      "Added to your mission list. Priorities updated.",
      "Task registered. Your productivity system is updated."
    ],
    stocks_check: [
      "Pulling live market data. One moment.",
      "Accessing financial networks. Stand by.",
      "Market analysis incoming. Here's the latest."
    ],
    web_search: [
      "Searching now. Knowledge is power.",
      "Let me find that for you. One moment.",
      "Querying databases. Here's what I discovered."
    ],
    github_info: [
      "Accessing your GitHub. Repositories secure.",
      "Connecting to your codebase. Stand by.",
      "GitHub integration active. Here are your stats."
    ],
    file_list: [
      "Scanning project directory. Here's your file system.",
      "File system mapped. Let me show you.",
      "Directory scan complete. Your project structure:"
    ],
    reminder_add: [
      "Reminder set. I'll make sure you don't forget.",
      "Scheduled and logged. Your memory assistant is on it.",
      "Added to your timeline. No missed deadlines."
    ],
    life_score: [
      "Calculating your life metrics. Let's see how you're doing.",
      "Performance analysis ready. Your dashboard is updated.",
      "Health and productivity scan complete. Here's your score."
    ],
    greeting_morning: [
      `Good morning, Ankith. It's ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}. All systems operational. Ready to make today exceptional.`,
      "Rise and shine, Ankith. The day is full of potential. What's our first mission?",
      "Morning, Ankith. Systems check complete. Everything is running at peak efficiency."
    ],
    greeting_night: [
      "Good night, Ankith. Excellent work today. Systems entering rest mode.",
      "Shutting down for the night. You've earned the rest. Sleep well.",
      "Rest well, Ankith. Tomorrow awaits with new possibilities."
    ],
    gratitude: [
      "Always at your service, Ankith.",
      "You're welcome. I'm here whenever you need me.",
      "The pleasure is mine. MIKE is always ready."
    ],
    time_check: [
      `It's currently ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} on ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`,
      `The time is ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`
    ],
    general_query: [
      "Processing your request. One moment.",
      "Let me handle that for you, Ankith.",
      "Working on it. Results incoming."
    ]
  };
  
  const options = responses[command.action] || responses.general_query;
  const baseResponse = options[Math.floor(Math.random() * options.length)];
  
  return result ? `${baseResponse} ${result}` : baseResponse;
}

function prepareSpeechResponse(text) {
  return text
    .replace(/```[\s\S]*?```/g, 'Code block removed for speech.')
    .replace(/[#*_~`]/g, '')
    .replace(/\n\n/g, '. ')
    .replace(/\n/g, ' ')
    .trim();
}

function getVoiceConfig(voiceId) {
  const configs = {
    'british-male': { lang: 'en-GB', pitch: 1.0, rate: 0.9, name: 'British Male' },
    'british-female': { lang: 'en-GB', pitch: 1.1, rate: 0.95, name: 'British Female' },
    'american-male': { lang: 'en-US', pitch: 1.0, rate: 0.95, name: 'American Male' },
    'american-female': { lang: 'en-US', pitch: 1.1, rate: 0.95, name: 'American Female' },
    'indian-british': { lang: 'en-GB', pitch: 0.95, rate: 0.85, name: 'Indo-British' },
    'european-male': { lang: 'en-US', pitch: 0.9, rate: 0.85, name: 'European Male' }
  };
  
  return configs[voiceId] || configs['indian-british'];
}

module.exports = { 
  processVoice, 
  detectVoiceCommand,
  prepareSpeechResponse,
  getVoiceConfig,
  generateJarvisResponse 
};
