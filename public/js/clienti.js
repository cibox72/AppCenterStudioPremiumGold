// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MODULO 02 GESTIONE CLIENTI v15 (R2 CRUD)
// =========================================================================

// 🌐 Configurazione Nuova Infrastruttura Cloudflare Privata
const API_URL = 'https://workers.dev';
const STUDIO_ID = localStorage.getItem('current_studio_id') || 'STU-001'; 
const STUDIO_TOKEN = localStorage.getItem('studio_token') || '58879@Stella';

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadClienti();
    setupForm();
});

// Carica lista clienti
async function loadClienti() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        const data = await response.json();

        const listContainer = document.getElementById('clienti-list');

        // Nel nuovo sistema il caricamento restituisce direttamente l'array o l'errore
        if (Array.isArray(data) && data.length > 0) {
            listContainer.innerHTML = data.map(cliente => `
                <div class="cliente-card">
                    <div class="cliente-info">
                        <h3>${cliente.nome} ${cliente.cognome}</h3>
                        <p>📧 ${cliente.email || 'N/A'} | 📱 ${cliente.telefono || 'N/A'}</p>
                        <p>📍 ${cliente.indirizzo || 'N/A'}</p>
                    </div>
                    <div class="cliente-actions">
                        <button class="btn btn-primary" onclick="editCliente('${cliente.id}')">Modifica</button>
                        <button class="btn btn-danger" onclick="deleteCliente('${cliente.id}')">Elimina</button>
                    </div>
                </div>
            `).join('');
        } else {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Nessun cliente trovato</h3>
                    <p>Clicca "Nuovo Cliente" per aggiungere il primo cliente</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Errore caricamento clienti:', error);
        alert('Errore di connessione');
    }
}

// Setup form
function setupForm() {
    const form = document.getElementById('cliente-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveCliente();
        });
    }
}

// Apri modal
function openModal(cliente = null) {
    const modal = document.getElementById('cliente-modal');
    const title = document.getElementById('modal-title');
    
    if (cliente) {
        title.textContent = 'Modifica Cliente';
        document.getElementById('cliente-id').value = cliente.id;
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('cognome').value = cliente.cognome;
        document.getElementById('email').value = cliente.email || '';
        document.getElementById('telefono').value = cliente.telefono || '';
        document.getElementById('indirizzo').value = cliente.indirizzo || '';
        document.getElementById('note').value = cliente.note || '';
    } else {
        title.textContent = 'Nuovo Cliente';
        const form = document.getElementById('cliente-form');
        if (form) form.reset();
        document.getElementById('cliente-id').value = '';
    }
    
    modal.classList.add('active');
}

// Chiudi modal
function closeModal() {
    const modal = document.getElementById('cliente-modal');
    if (modal) modal.classList.remove('active');
}

// Salva cliente
async function saveCliente() {
    const clienteIdInput = document.getElementById('cliente-id').value;
    
    // 1. Carichiamo la lista attuale dal database Cloud R2 per aggiornarla
    let clienti = [];
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        clienti = await response.json();
        if (!Array.isArray(clienti)) clienti = [];
    } catch (e) {
        clienti = [];
    }

    const campiCliente = {
        id: clienteIdInput || 'CLI-' + Math.floor(100000 + Math.random() * 900000),
        studio_id: STUDIO_ID,
        nome: document.getElementById('nome').value,
        cognome: document.getElementById('cognome').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        indirizzo: document.getElementById('indirizzo').value,
        note: document.getElementById('note').value
    };

    if (clienteIdInput) {
        const index = clienti.findIndex(c => c.id === clienteIdInput);
        if (index !== -1) {
            clienti[index] = campiCliente;
        }
    } else {
        clienti.push(campiCliente);
    }

    // 2. Salviamo l'intero array aggiornato su R2
    try {
        const response = await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            },
            body: JSON.stringify({
                studio_id: STUDIO_ID,
                chiave: 'clienti',
                dati: clienti
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(clienteIdInput ? 'Cliente aggiornato!' : 'Cliente creato!');
            closeModal();
            loadClienti();
        } else {
            alert('Errore: ' + (result.message || 'Operazione fallita'));
        }
    } catch (error) {
        console.error('Errore salvataggio:', error);
        alert('Errore di connessione');
    }
}

// Modifica cliente
async function editCliente(clienteId) {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        const clienti = await response.json();
        
        const cliente = clienti.find(c => c.id === clienteId);

        if (cliente) {
            openModal(cliente);
        } else {
            alert('Errore nel caricamento del cliente');
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore di connessione');
    }
}

// Elimina cliente
async function deleteCliente(clienteId) {
    if (!confirm('Sei sicuro di voler eliminare questo cliente?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        let clienti = await response.json();
        if (!Array.isArray(clienti)) clienti = [];
        
        clienti = clienti.filter(c => c.id !== clienteId);

        const saveResponse = await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            },
            body: JSON.stringify({
                studio_id: STUDIO_ID,
                chiave: 'clienti',
                dati: clienti
            })
        });

        const result = await saveResponse.json();

        if (result.success) {
            alert('Cliente eliminato!');
            loadClienti();
        } else {
            alert('Errore nell\'eliminazione');
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Errore di connessione');
    }
}
