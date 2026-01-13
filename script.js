/* =========================================
   CONFIGURATION & DATA
   ========================================= */
const CONFIG = {
    passwords: {
        main: "ZUNAR",
        secret: "PINKI"
    },
    // EDIT THE LETTER TEXT HERE
    letter: `My Dearest,

Happy Birthday! 🎂✨

I wanted to make something special for you, something that lasts longer than a cake and shines brighter than a candle.

You bring so much joy into the world just by being you. Every smile you share lights up the room, and I am so lucky to know you.

May this year bring you all the success, happiness, and love you deserve. Keep shining! 

With all my love,
[Your Name] ❤️`,
    
    // TELEGRAM CONFIG (Replace with your actual details)
    telegram: {
        token: "YOUR_TELEGRAM_BOT_TOKEN_HERE",
        chatId: "YOUR_CHAT_ID_HERE"
    }
};

/* =========================================
   DOM ELEMENTS
   ========================================= */
const screens = {
    login: document.getElementById('login-screen'),
    birthday: document.getElementById('birthday-screen'),
    preview: document.getElementById('letter-preview'),
    letter: document.getElementById('full-letter')
};

const modals = {
    secret: document.getElementById('secret-modal'),
    reply: document.getElementById('reply-modal')
};

const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

/* =========================================
   PAGE 1: LOGIN LOGIC
   ========================================= */
function checkMainPassword() {
    const input = document.getElementById('main-password');
    const error = document.getElementById('error-msg');
    const card = document.querySelector('#login-screen .glass-card');

    if (input.value.toUpperCase() === CONFIG.passwords.main) {
        error.textContent = "";
        playMusic();
        switchScreen('login', 'birthday');
        startConfetti();
    } else {
        error.textContent = "Oops! Wrong password 🙈";
        card.classList.add('shake-anim');
        setTimeout(() => card.classList.remove('shake-anim'), 500);
    }
}

/* =========================================
   PAGE 2: SECRET BUTTON & MODAL
   ========================================= */
function showSecretLogin() {
    modals.secret.style.display = "flex";
}

function closeSecretModal() {
    modals.secret.style.display = "none";
}

function checkSecretPassword() {
    const input = document.getElementById('secret-password');
    const error = document.getElementById('secret-error');
    const card = document.querySelector('#secret-modal .glass-card');

    if (input.value.toUpperCase() === CONFIG.passwords.secret) {
        closeSecretModal();
        switchScreen('birthday', 'preview');
    } else {
        error.textContent = "Wrong secret code 🔒";
        card.classList.add('shake-anim');
        setTimeout(() => card.classList.remove('shake-anim'), 500);
    }
}

/* =========================================
   PAGE 3 & 4: LETTER LOGIC
   ========================================= */
function openFullLetter() {
    switchScreen('preview', 'letter');
    typeWriterEffect(CONFIG.letter, 'typewriter-text');
}

function typeWriterEffect(text, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    let i = 0;
    const speed = 50;

    function type() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

/* =========================================
   REPLY FEATURE (TELEGRAM)
   ========================================= */
function showReplyForm() {
    modals.reply.style.display = "flex";
}

function closeReplyModal() {
    modals.reply.style.display = "none";
}

async function sendTelegramMessage() {
    const name = document.getElementById('sender-name').value;
    const msg = document.getElementById('sender-msg').value;
    const status = document.getElementById('reply-status');

    if (!name || !msg) {
        status.textContent = "Please fill in all fields 🥺";
        status.style.color = "#ff4757";
        return;
    }

    status.textContent = "Sending love... 💌";
    status.style.color = "#666";

    const text = `💌 *New Birthday Reply* 💌\n\n👤 *From:* ${name}\n💬 *Message:* ${msg}`;
    const url = `https://api.telegram.org/bot${CONFIG.telegram.token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.telegram.chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            status.textContent = "Your reply has been sent 💖";
            status.style.color = "#27c93f";
            setTimeout(closeReplyModal, 2000);
            document.getElementById('sender-name').value = '';
            document.getElementById('sender-msg').value = '';
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        status.textContent = "Error sending message 😢";
        status.style.color = "#ff4757";
    }
}

/* =========================================
   UTILITIES & ANIMATIONS
   ========================================= */
function switchScreen(hideId, showId) {
    screens[hideId].style.opacity = '0';
    setTimeout(() => {
        screens[hideId].classList.remove('active');
        screens[showId].classList.add('active');
        setTimeout(() => {
            screens[showId].style.opacity = '1';
        }, 50);
    }, 500);
}

function playMusic() {
    audio.play().catch(error => console.log("Music play failed:", error));
    musicBtn.classList.remove('hidden');
}

musicBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        audio.pause();
        musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

/* =========================================
   CONFETTI
   ========================================= */
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff7eb3', '#ffb6c1', '#ace0f9', '#fff1eb', '#f8a5c2'];

    for (let i = 0; i < 100; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 10 - 5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            p.y += p.speed;
            p.angle += p.spin;

            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}
