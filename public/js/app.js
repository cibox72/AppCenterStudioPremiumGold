// Configurazione
const API_URL = 'https://appcenter-api.mairaluigi.workers.dev';

// Stato applicazione
let currentUser = null;
let currentStudio = null;

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    showSection('login');
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Navigazione
function showSection(sectionName) {
    // Nascondi tutte le sezioni
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    
    // Mostra sezione selezionata
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
    }
}

function showStudioSection(sectionName) {
    const studioContent = document.getElementById('studio-content');
    
    switch(sectionName) {
        case 'preventivi':
            studioContent.innerHTML = '<h3>Preventivi</h3><p>Gestione preventivi in sviluppo...</p>';
            break;
        case 'clienti':
            studioContent.innerHTML = '<h3>Clienti</h3><p>Gestione clienti in sviluppo...</p>';
            break;
        case 'foto':
            studioContent.innerHTML = '<h3>Foto</h3><p>Gestione foto in sviluppo...</p>';
            break;
        case 'agenda':
            studioContent.innerHTML = '<h3>Agenda</h3><p>Gestione agenda in sviluppo...</p>';
            break;
        case 'negozio':
            studioContent.innerHTML = '<h3>Negozio</h3><p>Gestione negozio in sviluppo...</p>';
            break;
        default:
            studioContent.innerHTML = '<p>Seleziona una sezione</p>';
    }
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Login admin hardcoded
    if (username === 'admin' && password === '58879@Stella') {
        currentUser = { type: 'admin', username: 'admin' };
        showSection('admin');
        loadAdminStats();
        return;
    }
    
    // Login studio (da implementare con API)
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = { type: 'studio', ...data };
            showSection('studio');
        } else {
            alert('Credenziali non valide');
        }
    } catch (error) {
        console.error('Errore login:', error);
        alert('Errore di connessione');
    }
}

// Admin Functions
async function loadAdminStats() {
    try {
        // Stats mock per ora
        document.getElementById('studi-attivi').textContent = '0';
        document.getElementById('fatturato').textContent = '€0';
    } catch (error) {
        console.error('Errore caricamento stats:', error);
    }
}

function creaStudio() {
    const nome = prompt('Nome dello studio:');
    if (!nome) return;
    
    const telefono = prompt('Telefono:');
    const email = prompt('Email:');
    
    // Genera ID univoco
    const studioId = 'STU-' + Date.now();
    
    // Genera password casuale
    const password = generaPassword();
    
    alert(`Studio creato con successo!\n\nID: ${studioId}\nNome: ${nome}\nEmail: ${email}\nPassword: ${password}\n\nLink di accesso: ${window.location.origin}/studio.html?id=${studioId}`);
    
    // Salva studio (da implementare con API)
    saveStudio({ studioId, nome, telefono, email, password, attivo: true });
}

function generaPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function saveStudio(studio) {
    try {
        await fetch(`${API_URL}/studi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studio)
        });
    } catch (error) {
        console.error('Errore salvataggio studio:', error);
    }
}

function visualizzaStudi() {
    const listaDiv = document.getElementById('studi-lista');
    const container = document.getElementById('studi-container');
    
    // Mock dati per ora
    container.innerHTML = '<p>Nessuno studio creato ancora</p>';
    listaDiv.classList.remove('hidden');
}

// Utility
function logout() {
    currentUser = null;
    currentStudio = null;
    showSection('login');
    document.getElementById('login-form').reset();
}

console.log('AppCenterStudioPremiumGold caricato!');
