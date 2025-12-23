console.log("🎄 Script starting...");

const SUPABASE_URL = 'https://xvepmfhfkxrxhyftfqts.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LUotqKU7-6Q1RPNbzyxBAQ_eR9xJwoo';
const HOST_CODE = "Jiaxin2025";

let supabase = null;
let allQuestions = [];
let currentPickId = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded - Initializing...");

    // Check Supabase
    if (typeof window.supabase === 'undefined') {
        console.error("CRITICAL: Supabase library not loaded!");
        showToast("Error: Database library missing");
        return;
    }

    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase connected");
        initSync();
    } catch (e) {
        console.error("Supabase Init Error", e);
        showToast("Error connecting to database");
    }

    createSnow();

    // Check Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.warn("Lucide icons library not loaded yet.");
        // Try again in a bit
        setTimeout(() => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 1000);
    }
});

// Sync Logic (Realtime)
function initSync() {
    fetchData();
    supabase.channel('public:questions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, payload => {
            console.log("Change received", payload);
            fetchData();
        })
        .subscribe();
}

async function fetchData() {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

    if (data) {
        allQuestions = data;
        renderStats();
        renderList();
    }
}

// User Actions
async function submitQuestion() {
    const input = document.getElementById('question-input');
    const text = input.value.trim();
    const btn = document.getElementById('submit-btn');

    if (!text) return;

    // Loading State
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Sending...`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const { error } = await supabase
        .from('questions')
        .insert([{ text: text, status: 'pending' }]);

    if (error) {
        console.error("Submission error:", error);
        showToast("Connection failed. Try again!");
        btn.innerHTML = `<i data-lucide="x-circle" class="w-5 h-5"></i> Failed`;
    } else {
        input.value = '';
        showToast("🎁 Gift dropped in the bag!");
        btn.innerHTML = `<i data-lucide="check" class="w-5 h-5"></i> Sent!`;
    }

    // Reset Button
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="send" class="w-5 h-5"></i> Drop in the Bag`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 2000);
}

// Navigation & Auth (Hoisted)
function switchView(view) {
    const guestView = document.getElementById('view-guest');
    const hostLock = document.getElementById('view-host-lock');
    const hostPanel = document.getElementById('view-host-panel');
    const btnGuest = document.getElementById('btn-guest');
    const btnHost = document.getElementById('btn-host');

    // Reset
    guestView.classList.add('hidden');
    hostLock.classList.add('hidden');
    hostPanel.classList.add('hidden');
    btnGuest.className = "px-5 py-2 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white";
    btnHost.className = "px-5 py-2 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white";

    if (view === 'guest') {
        guestView.classList.remove('hidden');
        btnGuest.className = "px-5 py-2 rounded-lg text-xs font-bold transition-all bg-red-600 text-white shadow-lg";
    } else {
        btnHost.className = "px-5 py-2 rounded-lg text-xs font-bold transition-all bg-red-600 text-white shadow-lg";
        if (sessionStorage.getItem('host_unlocked')) {
            hostPanel.classList.remove('hidden');
        } else {
            hostLock.classList.remove('hidden');
        }
    }
}

function checkPasscode() {
    const input = document.getElementById('passcode-input');
    if (input.value === HOST_CODE) {
        sessionStorage.setItem('host_unlocked', 'true');
        switchView('host');
    } else {
        input.classList.add('shake');
        input.value = '';
        showToast("Wrong Passcode! 🍪");
        setTimeout(() => input.classList.remove('shake'), 500);
    }
}

function lockHost() {
    sessionStorage.removeItem('host_unlocked');
    switchView('host');
}

// Host Logic
function pickQuestion() {
    const pending = allQuestions.filter(q => q.status === 'pending');

    if (pending.length === 0) return showToast("The bag is empty! 🎅");

    // UI Transition
    document.getElementById('picker-idle').classList.add('hidden');
    document.getElementById('picker-result').classList.remove('hidden');

    // Animation Loop
    let count = 0;
    const maxCount = 15;
    const interval = setInterval(() => {
        const randomQ = pending[Math.floor(Math.random() * pending.length)];
        document.getElementById('picked-text').innerText = `"${randomQ.text}"`;
        count++;

        if (count >= maxCount) {
            clearInterval(interval);
            currentPickId = randomQ.id;
        }
    }, 80);
}

async function markAnswered() {
    if (!currentPickId) return;

    await supabase
        .from('questions')
        .update({ status: 'answered' })
        .eq('id', currentPickId);

    // Reset UI
    document.getElementById('picker-result').classList.add('hidden');
    document.getElementById('picker-idle').classList.remove('hidden');
    currentPickId = null;
}

async function deleteQ(id) {
    if (confirm("Are you sure you want to delete this?")) {
        await supabase.from('questions').delete().eq('id', id);
    }
}

// UI Helpers
function renderStats() {
    const total = allQuestions.length;
    const pending = allQuestions.filter(q => q.status === 'pending').length;

    document.getElementById('stats-total').innerText = total;
    document.getElementById('stats-pending').innerText = pending;
}

function renderList() {
    const container = document.getElementById('question-list');

    if (allQuestions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 bg-black/10 rounded-2xl border border-white/5">
                <p class="text-slate-500 italic text-sm">No questions in the bag yet...</p>
            </div>`;
        return;
    }

    container.innerHTML = allQuestions.map(q => `
        <div class="glass p-4 rounded-xl flex justify-between items-start gap-3 transition-all ${q.status === 'answered' ? 'opacity-40 bg-black/20' : 'bg-white/5'}">
            <p class="text-sm font-medium leading-relaxed ${q.status === 'answered' ? 'line-through text-slate-400' : 'text-white'}">
                ${q.text}
            </p>
            <button onclick="deleteQ(${q.id})" class="text-white/20 hover:text-red-500 transition-colors p-1 shrink-0">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    t.classList.remove('hidden');
    t.classList.add('flex');
    setTimeout(() => {
        t.classList.remove('flex');
        t.classList.add('hidden');
    }, 3000);
}

// Snow Effect
function createSnow() {
    const container = document.getElementById('snow-container');
    const count = 30;
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.innerHTML = '❄';
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.animationDuration = (Math.random() * 10 + 10) + 's';
        flake.style.animationDelay = (Math.random() * 10) + 's';
        flake.style.opacity = Math.random() * 0.3;
        flake.style.fontSize = (Math.random() * 20 + 10) + 'px';
        container.appendChild(flake);
    }
}
