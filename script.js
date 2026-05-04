// ============================================================
//  SCRIPT.JS — AI Presentation Website
//  Handles: slide navigation, keyboard, progress bar,
//           nav dots, and the demo AI chat simulation
// ============================================================

// ---- Step 1: Find all slides and set up state ----
const slides      = document.querySelectorAll('.slide');   // all 12 slides
const totalCount  = slides.length;                          // should be 12
let   currentIndex = 0;                                     // start on slide 1 (index 0)

// ---- Step 2: Update the total slide number shown in corner ----
document.getElementById('totalSlides').textContent = totalCount;

// ============================================================
//  BUILD NAV DOTS
//  Creates one small dot per slide at the bottom bar
// ============================================================
function buildNavDots() {
  const container = document.getElementById('navDots');
  container.innerHTML = ''; // clear any old dots

  for (let i = 0; i < totalCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'nav-dot' + (i === 0 ? ' active' : ''); // first dot starts active
    dot.setAttribute('data-index', i);
    dot.setAttribute('title', `Slide ${i + 1}`); // tooltip on hover

    // Clicking a dot jumps to that slide
    dot.addEventListener('click', () => goToSlide(i));
    container.appendChild(dot);
  }
}

// ============================================================
//  GO TO SLIDE
//  The main function that transitions from one slide to another
// ============================================================
function goToSlide(newIndex) {
  // Don't do anything if already on this slide
  if (newIndex === currentIndex) return;

  const oldSlide = slides[currentIndex]; // the slide we're leaving
  const newSlide = slides[newIndex];     // the slide we're going to

  // Add exit animation to the OLD slide (slides left)
  oldSlide.classList.remove('active');
  oldSlide.classList.add('exit-left');

  // After the CSS transition is done, remove the exit class so it hides cleanly
  setTimeout(() => {
    oldSlide.classList.remove('exit-left');
  }, 500); // matches --transition: 0.5s in CSS

  // Show the NEW slide
  newSlide.classList.add('active');

  // Update our tracker variable
  currentIndex = newIndex;

  // Now update all the UI that depends on the current slide
  updateUI();
}

// ============================================================
//  CHANGE SLIDE (used by Next/Back buttons)
//  direction: +1 = go forward, -1 = go backward
// ============================================================
function changeSlide(direction) {
  const newIndex = currentIndex + direction;

  // Make sure we don't go below 0 or above the last slide
  if (newIndex < 0 || newIndex >= totalCount) return;

  goToSlide(newIndex);
}

// ============================================================
//  UPDATE UI
//  Refreshes all the little visual pieces after a slide change
// ============================================================
function updateUI() {
  // 1. Update progress bar width
  //    e.g. slide 3 of 12 = (3/12) * 100 = 25%
  const progressPercent = ((currentIndex + 1) / totalCount) * 100;
  document.getElementById('progressBar').style.width = progressPercent + '%';

  // 2. Update the slide counter (e.g. "3 / 12")
  document.getElementById('currentSlide').textContent = currentIndex + 1;

  // 3. Enable/disable the Back button
  //    (disabled on first slide, enabled otherwise)
  document.getElementById('prevBtn').disabled = currentIndex === 0;

  // 4. Change Next button text on the last slide
  const nextBtn = document.getElementById('nextBtn');
  if (currentIndex === totalCount - 1) {
    nextBtn.textContent = '✓ Done';   // last slide — no "next"
    nextBtn.disabled = true;
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = false;
  }

  // 5. Update the nav dots — highlight the active one
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

// ============================================================
//  KEYBOARD NAVIGATION
//  Arrow keys let you navigate slides hands-free
// ============================================================
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    changeSlide(+1); // → or ↓ = next slide
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    changeSlide(-1); // ← or ↑ = previous slide
  }
});

// ============================================================
//  DEMO AI CHAT — Slide 11
//  This simulates what a real AI website does.
//  Instead of calling a real API, we match keywords and
//  return pre-written helpful answers.
// ============================================================

// A list of keywords → matching answers
// The AI checks the user's question for these keywords
const fakeAIResponses = {
  'html': '📄 HTML stands for HyperText Markup Language! It\'s the skeleton of every web page. You use tags like <div>, <p>, and <h1> to tell the browser what things are.',
  'css': '🎨 CSS = Cascading Style Sheets! It\'s how you make a website look beautiful. You control colors, fonts, sizes, spacing, and even animations with CSS.',
  'javascript': '⚡ JavaScript is the muscle of the web! It makes your website interactive — when you click a button or see a pop-up, that\'s JavaScript doing its job.',
  'js': '⚡ JavaScript (or JS) adds interactivity to your pages. It can show/hide things, fetch data from the internet, and react to what users do!',
  'ai': '🤖 AI stands for Artificial Intelligence! It\'s software trained on huge amounts of text data, so it can understand questions and give smart answers — just like I\'m doing now!',
  'api': '🔌 An API (Application Programming Interface) is like a power socket. You plug your website in, and you get access to services like AI, maps, weather, and more. fetch() in JavaScript is how you call an API!',
  'anti-gravity': '✨ Anti-Gravity in coding means using smart tools and shortcuts so your work feels weightless! Instead of building everything from scratch, you use AI APIs, ready-made components, and hosted services.',
  'gravity': '✨ Anti-Gravity coding means you let powerful tools carry the heavy load for you — so you can focus on building cool things!',
  'backend': '⚙️ The backend is the behind-the-scenes part of a website. Users don\'t see it, but it handles requests, talks to databases, and connects to services like the AI API.',
  'website': '🌐 A website is just files (HTML, CSS, JS) that your browser reads and renders visually. You can build one with a simple text editor!',
  'fetch': '📡 fetch() is a JavaScript function that lets your website talk to external services (like an AI API) over the internet. You send a question → you get an answer back!',
  'hosting': '☁️ Hosting means putting your website online so others can visit it. Vercel and Netlify offer free hosting — just drag and drop your files!',
  'hello': '👋 Hello! I\'m your AI assistant for this presentation. Ask me about HTML, CSS, JavaScript, APIs, or anything we covered in the slides!',
  'hi': '👋 Hi there! Great to meet you. Ask me anything about building an AI website!',
  'how': '🤔 Great question! The website works like this: you type → JS captures it → fetch() sends it to the AI API → AI replies → the answer shows up on screen. Magic!',
  'what': '🤖 I can explain HTML, CSS, JavaScript, APIs, AI, Anti-Gravity coding, hosting, and more. Try asking me a specific question!',
  'help': '🆘 Sure! You can ask me: "What is HTML?", "What is an API?", "What is AI?", "What is the backend?", or "What is hosting?" Give it a try!',
};

// Default response when no keywords match
const defaultResponse = '🤖 Interesting question! In a real AI website, I\'d call the AI API right now and get a smart answer for you. For this demo, try asking about: HTML, CSS, JavaScript, API, AI, backend, hosting, or anti-gravity!';

// ---- The main demo function ----
function sendDemo() {
  const input    = document.getElementById('demoInput');
  const userText = input.value.trim(); // remove extra spaces

  // Don't do anything if the input is empty
  if (!userText) return;

  const chatWindow = document.getElementById('chatWindow');

  // -- Show the user's message in the chat --
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user-message';
  userMsg.innerHTML = `
    <span class="msg-icon">🙋</span>
    <div class="msg-bubble">${escapeHTML(userText)}</div>
  `;
  chatWindow.appendChild(userMsg);

  // -- Clear the input box --
  input.value = '';

  // -- Scroll to bottom of chat --
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // -- Show a "typing..." indicator while "AI thinks" --
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-message';
  typingIndicator.innerHTML = `
    <span class="msg-icon">🤖</span>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // -- After a short delay, remove typing and show the answer --
  //    This simulates the AI "thinking" (normally ~1-2 seconds)
  setTimeout(() => {
    // Remove the typing indicator
    chatWindow.removeChild(typingIndicator);

    // Figure out the best answer to give
    const answer = findBestAnswer(userText.toLowerCase());

    // Create the AI reply message
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-message ai-message';
    aiMsg.innerHTML = `
      <span class="msg-icon">🤖</span>
      <div class="msg-bubble">${answer}</div>
    `;
    chatWindow.appendChild(aiMsg);

    // Scroll to bottom again so user sees the new message
    chatWindow.scrollTop = chatWindow.scrollHeight;

  }, 1200); // 1.2 second delay — feels natural
}

// ---- Find the best answer from our responses list ----
function findBestAnswer(question) {
  // Loop through all our keywords and check if the question contains them
  for (const [keyword, response] of Object.entries(fakeAIResponses)) {
    if (question.includes(keyword)) {
      return response; // Return the first matching answer
    }
  }
  // If nothing matches, return the default message
  return defaultResponse;
}

// ---- Safety: prevent HTML injection (XSS protection) ----
// This makes sure if someone types <script> it shows as text, not code
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ============================================================
//  INIT — Run this when the page first loads
// ============================================================
function init() {
  buildNavDots();   // Create the dot indicators
  updateUI();       // Set the initial state (button states, counter, etc.)
}

// Call init() once the page is ready
init();
