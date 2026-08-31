// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MAIN ENGINE & ADMIN CONTROL v16.5 (PRO)
// =========================================================================

const API_URL = 'https://workers.dev';
const STUDIO_TOKEN = '58879@Stella'; 

let currentUser = null;
let currentStudio = null;

let databaseStudiGlobali = [];
let databaseOfferteGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    showSection('login');
});

// 🔐 FUNZIONE DI INGRESSO UNIVERSALE LEGATA DIRETTAMENTE AL PULSANTE
async function handleLoginManuale() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (!usernameInput || !passwordInput) {
        alert("Errore d'interfaccia: controlla i file html.");
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        alert("⚠️ Per favore, inserisci utente e password.");
        return;
    }
    
    // 👑 1. Controllo Immediato ed Isolato Ruolo Fornitore Supremo (Admin)
    if (username === 'admin' && password === '58879@Stella') {
        currentUser = { type: 'admin', username: 'admin' };
        showSection('admin');
        await inizializzaPannelloFornitore();
        return;
    }
    
    // 📸 2. Ruolo: Studio Fotografico (Lettura Database Cloud R2)
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=studi_registrati`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        
        const studi = await response.json();
        if (!Array.isArray(studi)) {
            alert('❌ Nessuno studio risulta registrato nel Cloud.');
            return;
        }

        const studioTrovato = studi.find(s => s.email === username && s.password === password);
        
        if (studioTrovato) {
            if (parseInt(studioTrovato.attivo) === 0) {
                alert('❌ Accesso Negato: Il link di questo studio fotografico è stato disattivato dal Fornitore.');
                return;
            }
            currentUser = { type: 'studio', ...studioTrovato };
            currentStudio = studioTrovato.studio_id;
            
            localStorage.setItem('current_studio_id', studioTrovato.studio_id);
            localStorage.setItem('studio_token', STUDIO_TOKEN);
            
            showSection('studio');
        } else {
            alert('❌ Credenziali dello studio non valide.');
        }
    } catch (error) {
        console.error('Errore di rete cloud:', error);
        alert('❌ Impossibile connettersi a Cloudflare.');
    }
}

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
    if (!studioContent) return;
    
    switch(sectionName) {
        case 'preventivi':
            studioContent.innerHTML = '<h3>Preventivi</h3><p>Gestione preventivi caricata...</p>';
            if (typeof loadPreventivi === 'function') loadPreventivi();
            break;
        case 'clienti':
            studioContent.innerHTML = '<h3>Clienti</h3><p>Gestione clienti caricata...</p>';
            if (typeof loadClienti === 'function') loadClienti();
            break;
        case 'workflow':
            studioContent.innerHTML = '<h3>Workflow</h3><p>Gestione flusso di lavoro caricata...</p>';
            if (typeof caricaWorkflowCloud === 'function') caricaWorkflowCloud();
            break;
        case 'foto':
            studioContent.innerHTML = '<h3>Galleria & Selezione Album</h3><p>Configurazione provini attiva...</p>';
            break;
        default:
            studioContent.innerHTML = '<p>Seleziona una sezione dal menu</p>';
    }
}

// =========================================================================
// LOGICA LOGISTICA ADMIN / FORNITORE
// =========================================================================

async function inizializzaPannelloFornitore() {
    await caricaOfferteAdmin();
    await caricaStudiAdmin();
}

async function caricaOfferteAdmin() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=offerte_commerciali`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        databaseOfferteGlobali = await response.json();
        if (!Array.isArray(databaseOfferteGlobali)) databaseOfferteGlobali = [];
        
        const totOfferte = document.getElementById('offerte-totali');
        if (totOfferte) totOfferte.textContent = databaseOfferteGlobali.length;
        
        const selectOfferta = document.getElementById('admin-studio-offerta');
        if (selectOfferta) {
            selectOfferta.innerHTML = '<option value="">Seleziona un\'Offerta</option>' + 
                databaseOfferteGlobali.map(o => `<option value="${o.id}">${o.titolo} (${o.prezzo})</option>`).join('');
        }
        
        renderizzaListaOfferteAdmin();
    } catch (error) {
        console.error(error);
    }
}

function renderizzaListaOfferteAdmin() {
    const container = document.getElementById('offerte-list-container');
    if (!container) return;
    
    if (databaseOfferteGlobali.length === 0) {
        container.innerHTML = '<p style="color:#95a5a6; font-size:0.9em; text-align:center;">Nessuna offerta creata. Usa il form sopra.</p>';
        return;
    }
    
    container.innerHTML = databaseOfferteGlobali.map(o => `
        <div style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong style="color: #ecf0f1; font-size:0.95em;">${o.titolo}</strong><br>
                <span style="color: #2ecc71; font-size: 0.85em; font-weight: bold;">${o.prezzo}</span>
            </div>
            <div>
                <button type="button" onclick="caricaModificaOfferta('${o.id}')" style="padding: 4px 8px; font-size: 11px; background: #3498db; border: none; border-radius: 4px; color: white; cursor: pointer;">Modifica</button>
            </div>
        </div>
    `).join('');
}

async function handleSalvaOffertaAdmin() {
    const idInput = document.getElementById('admin-offerta-id').value;
    
    const nuovaOfferta = {
        id: idInput || 'OFF-' + Math.floor(100000 + Math.random() * 900000),
        titolo: document.getElementById('admin-offerta-titolo').value.trim(),
        prezzo: document.getElementById('admin-offerta-prezzo').value.trim(),
        descrizione: document.getElementById('admin-offerta-descrizione').value.trim()
    };
    
    if (idInput) {
        const index = databaseOfferteGlobali.findIndex(o => o.id === idInput);
        if (index !== -1) databaseOfferteGlobali[index] = nuovaOfferta;
    } else {
        databaseOfferteGlobali.push(nuovaOfferta);
    }
    
    try {
        await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Studio-Token': STUDIO_TOKEN },
            body: JSON.stringify({ studio_id: 'ADMIN_SYSTEM', chiave: 'offerte_commerciali', dati: databaseOfferteGlobali })
        });
        
        document.getElementById('admin-offerta-form').reset();
        document.getElementById('admin-offerta-id').value = '';
        document.getElementById('form-offerta-title').textContent = '🏷️ Gestione Offerte';
        alert('✅ Lista Offerte Sincronizzata su Cloudflare R2!');
        await caricaOfferteAdmin();
    } catch (error) {
        alert('Errore nel salvataggio dell\'offerta.');
    }
}

function caricaModificaOfferta(id) {
    const o = databaseOfferteGlobali.find(off => off.id === id);
    if (!o) return;
    document.getElementById('admin-offerta-id').value = o.id;
    document.getElementById('admin-offerta-titolo').value = o.titolo;
    document.getElementById('admin-offerta-prezzo').value = o.prezzo;
    document.getElementById('admin-offerta-descrizione').value = o.descrizione || '';
    document.getElementById('form-offerta-title').textContent = '📝 Modifica Offerta: ' + o.titolo;
}

async function caricaStudiAdmin() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=ADMIN_SYSTEM&chiave=studi_registrati`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        databaseStudiGlobali = await response.json();
        if (!Array.isArray(databaseStudiGlobali)) databaseStudiGlobali = [];
        
        const totStudi = document.getElementById('studi-attivi');
        if (totStudi) totStudi.textContent = databaseStudiGlobali.filter(s => parseInt(s.attivo) === 1).length;
        renderizzaArchivioStudiAdmin();
    } catch (error) {
        console.error(error);
    }
}

function renderizzaArchivioStudiAdmin() {
    const tbody = document.getElementById('studi-archivio-tbody');
    if (!tbody) return;
    
    if (databaseStudiGlobali.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color:#95a5a6;">Nessuno studio presente nell'archivio cloud.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = databaseStudiGlobali.map(s => {
