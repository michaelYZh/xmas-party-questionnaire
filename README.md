# 🎄 Jiaxin's Christmas Party Questionnaire

A festive, real-time web application designed for anonymous Q&A sessions during holiday parties. Guests drop questions into a digital "Santa's Bag," and the host randomly picks them for everyone to discuss!

## ✨ Features
- **Anonymous Submission**: Guests can ask anything without revealing their identity.
- **Real-time Live Feed**: Questions appear instantly (masked) and reveal when picked.
- **Host Admin Panel**: Secure area for the host to manage the game.
- **Visual Magic**:
    - 🌌 **Northern Lights**: A beautiful, deep green animated aurora background.
    - ❄️ **Snowfall**: Realistic snow falling from the very top of the screen.
    - 🎅 **Flying Santa**: Watch out for Santa flying across the screen every 5-10 seconds!
    - 🎊 **Confetti**: Celebratory effects when a new question is picked.

---

## 🎮 How to Interact

### 👋 For Guests (Everyone)
1.  **Open the App**: Navigate to the website on your phone or laptop.
2.  **Ask a Question**:
    - You'll see a big "Secret Question" box.
    - Type your funny question, holiday confession, or truth-or-dare prompt.
    - *Everything is 100% anonymous.*
3.  **Drop in the Bag**:
    - Click the **DROP IN THE BAG** button.
    - You'll get a confirmation toast ("Gift dropped in the bag!").
    - Your question is now added to the queue!

### 🎅 For the Host (Santa's Helper)
1.  **Enter Host Mode**:
    - Click the **Host** button in the top-right corner of the navigation bar.
2.  **Unlock the Panel**:
    - Enter the secret passcode: `Jiaxin2025`
    - Click **Unlock Panel**.
3.  **Control the Game**:
    - You'll see a Dashboard with stats ("Total" vs "Unopened").
    - **Drafts (Live Feed)**: Scroll down to see the masked list of questions.
4.  **Pick a Winner**:
    - Click the big **SELECT RANDOM 🎄** button.
    - 🎆 **Boom!** Confetti explodes, and a random question is revealed on the screen.
    - The question status updates to "Opened" for everyone to see.
5.  **Finish a Question**:
    - After the group discusses the question, click **Done**.
    - The question is crossed out in the Live Feed, and you're ready to pick the next one!

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Vanilla JS (ES Modules)
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Animations**: CSS Keyframes, Animate.css, Canvas Confetti
- **Icons**: Lucide Icons

## 🚀 Setup (Local)
1. Clone the repo.
2. Open `index.html` in your browser (or serve with a simple HTTP server).
3. Ensure the Supabase credentials in the script tag are valid.

*Merry Christmas!* 🎁
