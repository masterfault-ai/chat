// Store user data (In a real application, this would be handled by a backend)
let users = [];
let currentUser = null;
let messages = [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const chatInterface = document.getElementById('chatInterface');
const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');

// Toggle between login and register forms
function toggleForms() {
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        showChat();
        displayMessages();
    } else {
        alert('Invalid username or password');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    alert('Registration successful! Please login.');
    toggleForms();
}

// Show Chat Interface
function showChat() {
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    chatInterface.classList.remove('hidden');
}

// Send Message
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;

    const message = {
        content,
        sender: currentUser.username,
        timestamp: new Date().toISOString(),
        type: 'sent'
    };

    messages.push(message);
    displayMessages();
    messageInput.value = '';

    // Simulate received message (In a real application, this would be handled by the server)
    setTimeout(() => {
        const response = {
            content: `Echo: ${content}`,
            sender: 'Bot',
            timestamp: new Date().toISOString(),
            type: 'received'
        };
        messages.push(response);
        displayMessages();
    }, 1000);
}

// Display Messages
function displayMessages() {
    messageArea.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.type);
        messageElement.innerHTML = `
            <strong>${message.sender}</strong><br>
            ${message.content}
        `;
        messageArea.appendChild(messageElement);
    });
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Logout
function logout() {
    currentUser = null;
    messages = [];
    chatInterface.classList.add('hidden');
    loginForm.classList.remove('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

// Handle Enter key in message input
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Add some demo users
users.push(
    { username: 'demo', email: 'demo@example.com', password: 'demo123' },
    { username: 'test', email: 'test@example.com', password: 'test123' }
);
