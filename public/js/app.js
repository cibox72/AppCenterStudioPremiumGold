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
    
    // Login admin
    if (username === 'admin' && password === '58879@Stella') {
        currentUser = { type: 'admin', username: 'admin' };
        showSection('admin');
        loadAdminStats(); // Carica statistiche reali
        return;
    }
    
    // Login studio
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = { type: 'studio', ...data.studio };
            showSection('studio');
        } else {
            alert('Credenziali non valide');
        }
    } catch (error) {
        console.error('Errore login:', error);
        alert('Errore di connessione');
    }
}

// Carica statistiche admin
async function loadAdminStats() {
    try {
        // Carica studi
        const responseStudi = await fetch(`${API_URL}/api/studi`);
        const dataStudi = await responseStudi.json();
        
        if (dataStudi.success) {
            const studiAttivi = dataStudi.studi.filter(s => s.attivo === 1).length;
            document.getElementById('studi-attivi').textContent = studiAttivi;
        }
        
        // Carica fatturato (da implementare)
        document.getElementById('fatturato').textContent = '€0';
        
    } catch (error) {
        console.error('Errore caricamento stats:', error);
    }
}

// Crea studio
async function creaStudio() {
    const nome = prompt('Nome dello studio:');
    if (!nome) return;
    
    const email = prompt('Email:');
    const telefono = prompt('Telefono:');
    const indirizzo = prompt('Indirizzo:');
    const password = prompt('Password iniziale:');
    
    if (!email || !password) {
        alert('Email e password sono obbligatori');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/studi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, telefono, indirizzo, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`✅ Studio creato con successo!\n\nID: ${data.studio_id}\nEmail: ${email}\nPassword: ${password}`);
            loadAdminStats(); // Ricarica statistiche
        } else {
            alert('❌ Errore: ' + (data.message || 'Impossibile creare lo studio'));
        }
    } catch (error) {
        alert(' Errore di connessione');
    }
}

// Visualizza studi
async function visualizzaStudi() {
    try {
        const response = await fetch(`${API_URL}/api/studi`);
        const data = await response.json();
        
        if (data.success && data.studi.length > 0) {
            const container = document.getElementById('studi-container');
            container.innerHTML = data.studi.map(studio => `
                <div style="padding: 15px; border: 1px solid rgba(255,255,255,0.1); margin: 10px 0; border-radius: 8px; background: rgba(52, 73, 94, 0.4);">
                    <strong style="color: #ecf0f1; font-size: 1.1em;">${studio.nome}</strong><br>
                    <span style="color: #95a5a6; font-size: 0.9em;"> ${studio.email}</span><br>
                    <span style="color: #95a5a6; font-size: 0.9em;"> ${studio.telefono || 'N/A'}</span><br>
                    <span style="color: ${studio.attivo ? '#2ecc71' : '#e74c3c'}; font-size: 0.9em;">
                        ${studio.attivo ? '✅ Attivo' : '❌ Disattivo'}
                    </span><br>
                    <span style="color: #7f8c8d; font-size: 0.85em;">📅 Creato: ${new Date(studio.data_creazione).toLocaleDateString()}</span>
                </div>
            `).join('');
            
            document.getElementById('studi-lista').classList.remove('hidden');
        } else {
            alert('Nessuno studio trovato');
        }
    } catch (error) {
        alert('❌ Errore di connessione');
    }
}

// Utility
function logout() {
    currentUser = null;
    currentStudio = null;
    showSection('login');
    document.getElementById('login-form').reset();
}

console.log('AppCenter Studio Premium Gold caricato!');
