// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MODULO 01 PREVENTIVI v15 (R2 CRUD)
// =========================================================================

// 🌐 Configurazione Nuova Infrastruttura Cloudflare Privata
const API_URL = 'https://workers.dev';
const STUDIO_ID = localStorage.getItem('current_studio_id') || 'STU-001'; 
const STUDIO_TOKEN = localStorage.getItem('studio_token') || '58879@Stella';

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadPreventivi();
    loadClientiForSelect();
    setupForm();
});

// Carica preventivi
async function loadPreventivi() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=preventivi`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        const data = await response.json();

        const listContainer = document.getElementById('preventivi-list');
        if (!listContainer) return;

        if (Array.isArray(data) && data.length > 0) {
            listContainer.innerHTML = data.map(prev => `
                <div class="preventivo-card">
                    <div class="preventivo-header">
                        <h3 class="preventivo-titolo">${prev.titolo}</h3>
                        <div class="preventivo-importo">€${parseFloat(prev.importo).toFixed(2)}</div>
                    </div>
                    <div class="preventivo-info">
                        <p>👤 <strong>Cliente ID:</strong> ${prev.cliente_id || 'N/A'}</p>
                        <p>📅 <strong>Scadenza:</strong> ${prev.data_scadenza ? new Date(prev.data_scadenza).toLocaleDateString() : 'N/A'}</p>
                        <p>📝 <strong>Descrizione:</strong> ${prev.descrizione || 'N/A'}</p>
                        <p>
                            <strong>Stato:</strong> 
                            <span class="preventivo-stato stato-${prev.stato}">
                                ${prev.stato === 'in_attesa' ? '⏳ In attesa' : prev.stato === 'accettato' ? '✅ Accettato' : '❌ Rifiutato'}
                            </span>
                        </p>
                    </div>
                    <div class="preventivo-actions">
                        <button class="btn btn-primary" onclick="editPreventivo('${prev.id}')">Modifica</button>
                    </div>
                </div>
            `).join('');
        } else {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nessun preventivo trovato</h3>
                    <p>Clicca "Nuovo Preventivo" per creare il primo preventivo</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Errore caricamento preventivi:', error);
        alert('Errore di connessione');
    }
}

// Carica clienti per il select
async function loadClientiForSelect() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        const data = await response.json();

        const select = document.getElementById('cliente-select');
        if (!select) return;
        
        if (Array.isArray(data) && data.length > 0) {
            select.innerHTML = '<option value="">Seleziona un cliente</option>' + 
                data.map(c => `
                    <option value="${c.id}">${c.nome} ${c.cognome}</option>
                `).join('');
        }
    } catch (error) {
        console.error('Errore caricamento clienti:', error);
    }
}

// Setup form
function setupForm() {
    const form = document.getElementById('preventivo-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await savePreventivo();
        });
    }
}

// Apri modal
function openModal() {
    const modal = document.getElementById('preventivo-modal');
    if (!modal) return;
    
    document.getElementById('modal-title').textContent = 'Nuovo Preventivo';
    const form = document.getElementById('preventivo-form');
    if (form) form.reset();
    
    document.getElementById('preventivo-id').value = '';
    document.getElementById('stato').value = 'in_attesa';
    loadClientiForSelect();
    modal.classList.add('active');
}

// Chiudi modal
function closeModal() {
    const modal = document.getElementById('preventivo-modal');
    if (modal) modal.classList.remove('active');
}

// Salva preventivo
async function savePreventivo() {
    const preventivoId = document.getElementById('preventivo-id').value;
    let preventivi = [];
    
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=preventivi`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        preventivi = await response.json();
        if (!Array.isArray(preventivi)) preventivi = [];
    } catch (e) {
        preventivi = [];
    }

    const data = {
        id: preventivoId || 'PREV-' + Math.floor(100000 + Math.random() * 900000),
        studio_id: STUDIO_ID,
        cliente_id: document.getElementById('cliente-select').value,
        titolo: document.getElementById('titolo').value,
        descrizione: document.getElementById('descrizione').value,
        importo: parseFloat(document.getElementById('importo').value) || 0,
        stato: document.getElementById('stato').value,
        data_scadenza: document.getElementById('data-scadenza').value,
        updated_at: new Date().toISOString()
    };

    if (!data.cliente_id) {
        alert('Seleziona un cliente!');
        return;
    }

    if (preventivoId) {
        const index = preventivi.findIndex(p => p.id === preventivoId);
        if (index !== -1) preventivi[index] = data;
    } else {
        preventivi.push(data);
    }

    try {
        const response = await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            },
            body: JSON.stringify({
                studio_id: STUDIO_ID,
                chiave: 'preventivi',
                dati: preventivi
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(preventivoId ? 'Preventivo aggiornato!' : 'Preventivo creato!');
            closeModal();
            loadPreventivi();
        } else {
            alert('Errore: ' + (result.message || 'Operazione fallita'));
        }
    } catch (error) {
        console.error('Errore salvataggio:', error);
        alert('Errore di connessione');
    }
}

// Modifica preventivo
async function editPreventivo(preventivoId) {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=preventivi`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        const preventivi = await response.json();

        if (Array.isArray(preventivi)) {
            const preventivo = preventivi.find(p => p.id === preventivoId);
            if (preventivo) {
                await loadClientiForSelect();
                
                document.getElementById('modal-title').textContent = 'Modifica Preventivo';
                document.getElementById('preventivo-id').value = preventivo.id;
                document.getElementById('cliente-select').value = preventivo.cliente_id;
                document.getElementById('titolo').value = preventivo.titolo;
                document.getElementById('descrizione').value = preventivo.descrizione || '';
                document.getElementById('importo').value = preventivo.importo;
                document.getElementById('stato').value = preventivo.stato;
                document.getElementById('data-scadenza').value = preventivo.data_scadenza || '';
                
                document.getElementById('preventivo-modal').classList.add('active');
            }
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore di connessione');
    }
}
