// Store user data (In a real application, this would be handled by a backend)
let users = [];
let currentUser = null;
let selectedUser = null;
let chats = {};  // Store chats between users

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const chatInterface = document.getElementById('chatInterface');
const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const usersList = document.getElementById('usersList');
const currentUserDisplay = document.getElementById('currentUserDisplay');
const selectedUserDisplay = document.getElementById('selectedUserDisplay');
const userSearch = document.getElementById('userSearch');

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
        displayUsers();
        currentUserDisplay.textContent = currentUser.username;
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

// Display Users List
function displayUsers() {
    usersList.innerHTML = '';
    users.forEach(user => {
        if (user.username !== currentUser.username) {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            if (selectedUser && user.username === selectedUser.username) {
                userElement.classList.add('active');
            }
            userElement.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <div class="user-info">
                    <div class="username">${user.username}</div>
                </div>
            `;
            userElement.onclick = () => selectUser(user);
            usersList.appendChild(userElement);
        }
    });
}

// Select User to Chat
function selectUser(user) {
    selectedUser = user;
    selectedUserDisplay.textContent = user.username;
    messageInput.disabled = false;
    document.querySelector('.send-btn').disabled = false;
    
    // Update active state in users list
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
        if (item.querySelector('.username').textContent === user.username) {
            item.classList.add('active');
        }
    });

    displayMessages();
}

// Send Message
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !selectedUser) return;

    const chatId = getChatId(currentUser.username, selectedUser.username);
    if (!chats[chatId]) {
        chats[chatId] = [];
    }

    const message = {
        content,
        sender: currentUser.username,
        receiver: selectedUser.username,
        timestamp: new Date().toISOString()
    };

    chats[chatId].push(message);
    displayMessages();
    messageInput.value = '';
}

// Display Messages
function displayMessages() {
    if (!selectedUser) return;

    const chatId = getChatId(currentUser.username, selectedUser.username);
    const messages = chats[chatId] || [];

    messageArea.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(message.sender === currentUser.username ? 'sent' : 'received');
        
        const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            ${message.content}
            <div class="timestamp">${time}</div>
        `;
        messageArea.appendChild(messageElement);
    });
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Get unique chat ID for two users
function getChatId(user1, user2) {
    return [user1, user2].sort().join('-');
}

// Search Users
userSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const userItems = usersList.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        const username = item.querySelector('.username').textContent.toLowerCase();
        if (username.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Handle Enter key in message input
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Logout
function logout() {
    currentUser = null;
    selectedUser = null;
    messageInput.disabled = true;
    document.querySelector('.send-btn').disabled = true;
    chatInterface.classList.add('hidden');
    loginForm.classList.remove('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

// Add some demo users
users.push(
    { username: 'john', email: 'john@example.com', password: 'john123' },
    { username: 'emma', email: 'emma@example.com', password: 'emma123' },
    { username: 'mike', email: 'mike@example.com', password: 'mike123' }
);
