// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MAIN LOGIC v15 (R2 PRIVATE ENGINE)
// =========================================================================

// 🌐 Configurazione Nuova Infrastruttura Cloudflare Privata
const API_URL = 'https://workers.dev';
const STUDIO_TOKEN = '58879@Stella'; 

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

// Navigazione sezioni principali
function showSection(sectionName) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    
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

// 🔐 Login Protetto ed Autenticato
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // 1. Controllo Accesso Amministratore Supremo (Admin)
    if (username === 'admin' && password === '58879@Stella') {
        currentUser = { type: 'admin', username: 'admin' };
        showSection('admin');
        loadAdminStats(); 
        return;
    }
    
    // 2. Controllo Accesso Studio Fotografico (JSON CRUD su R2)
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=studi_registrati`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        
        const studi = await response.json();
        
        // Cerca lo studio all'interno del file JSON del database
        const studioTrovato = studi.find(s => s.email === username && s.password === password);
        
        if (studioTrovato) {
            if (studioTrovato.attivo === 0) {
                alert('❌ Questo studio è stato disattivato dall\'amministratore.');
                return;
            }
            currentUser = { type: 'studio', ...studioTrovato };
            currentStudio = studioTrovato.studio_id;
            
            // Salva la sessione locale per i moduli successivi
            localStorage.setItem('current_studio_id', studioTrovato.studio_id);
            localStorage.setItem('studio_token', STUDIO_TOKEN);
            
            showSection('studio');
        } else {
            alert('❌ Credenziali dello studio non valide.');
        }
    } catch (error) {
        console.error('Errore login:', error);
        alert('❌ Errore di connessione con il Cloud privato Cloudflare.');
    }
}

// Carica statistiche pannello Admin
async function loadAdminStats() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=studi_registrati`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        const studi = await response.json();
        
        if (Array.isArray(studi)) {
            const studiAttivi = studi.filter(s => s.attivo === 1).length;
            document.getElementById('studi-attivi').textContent = studiAttivi;
        } else {
            document.getElementById('studi-attivi').textContent = '0';
        }
        document.getElementById('fatturato').textContent = '€0';
        
    } catch (error) {
        console.error('Errore statistiche admin:', error);
    }
}

// Azione Admin: Crea un Nuovo Studio Fotografico (Aggiunta a file JSON su R2)
async function creaStudio() {
    const nome = prompt('Nome dello studio:');
    if (!nome) return;
    
    const email = prompt('Email di accesso:');
    const telefono = prompt('Telefono:');
    const indirizzo = prompt('Indirizzo studio:');
    const password = prompt('Password iniziale studio:');
    
    if (!email || !password) {
        alert('Email e password sono campi obbligatori per lo studio');
        return;
    }
    
    try {
        // 1. Carica l'elenco attuale degli studi
        const loadRes = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=studi_registrati`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        let studi = await loadRes.json();
        if (!Array.isArray(studi)) studi = [];

        // Genera un ID Studio univoco pulito (es: STU-1718292)
        const nuovoStudioId = 'STU-' + Math.floor(100000 + Math.random() * 900000);
        
        const nuovoStudio = {
            studio_id: nuovoStudioId,
            nome,
            email,
            telefono,
            indirizzo,
            password,
            attivo: 1,
            data_creazione: new Date().toISOString()
        };

        studi.push(nuovoStudio);

        // 2. Salva l'elenco aggiornato su Cloudflare R2
        const saveRes = await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            },
            body: JSON.stringify({
                studio_id: 'ADMIN_SYSTEM',
                chiave: 'studi_registrati',
                dati: studi
            })
        });

        const resData = await saveRes.json();
        
        if (resData.success) {
            alert(`✅ Studio creato con successo nel cloud R2!\n\nID: ${nuovoStudioId}\nEmail: ${email}\nPassword: ${password}`);
            loadAdminStats();
        } else {
            alert('❌ Errore nel salvataggio dello studio.');
        }
    } catch (error) {
        alert('❌ Errore di connessione durante la creazione.');
    }
}

// Azione Admin: Visualizza la lista completa degli studi
async function visualizzaStudi() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=studi_registrati`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        const studi = await response.json();
        
        const container = document.getElementById('studi-container');
        if (Array.isArray(studi) && studi.length > 0) {
            container.innerHTML = studi.map(studio => `
                <div style="padding: 15px; border: 1px solid rgba(255,255,255,0.1); margin: 10px 0; border-radius: 8px; background: rgba(52, 73, 94, 0.4);">
                    <strong style="color: #ecf0f1; font-size: 1.1em;">${studio.nome}</strong><br>
                    <span style="color: #95a5a6; font-size: 0.9em;"> 📧 ${studio.email}</span><br>
                    <span style="color: #95a5a6; font-size: 0.9em;"> 📞 ${studio.telefono || 'N/A'}</span><br>
                    <span style="color: ${studio.attivo ? '#2ecc71' : '#e74c3c'}; font-size: 0.9em;">
                        ${studio.attivo ? '✅ Studio Attivo' : '❌ Studio Disattivato'}
                    </span><br>
                    <span style="color: #7f8c8d; font-size: 0.85em;">📅 Creato: ${new Date(studio.data_creazione).toLocaleDateString()}</span>
                </div>
            `).join('');
            
            document.getElementById('studi-lista').classList.remove('hidden');
        } else {
            container.innerHTML = '<p style="color: #95a5a6; padding: 10px;">Nessuno studio presente nel database cloud.</p>';
            document.getElementById('studi-lista').classList.remove('hidden');
        }
    } catch (error) {
        alert('❌ Errore di caricamento della lista degli studi.');
    }
}

// Utility Logout
function logout() {
    currentUser = null;
    currentStudio = null;
    localStorage.removeItem('current_studio_id');
    localStorage.removeItem('studio_token');
    showSection('login');
    document.getElementById('login-form').reset();
}

console.log('AppCenter Studio Premium Gold - Sistema Privato R2 Attivo!');
