// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MODULO 02 GESTIONE CLIENTI v15 (R2 CRUD)
// =========================================================================

// 🌐 Recupero Configurazione e Sessione Privata dal Login principale
const API_URL = 'https://appcenter-api.mairaluigi-b2f.workers.dev';
const STUDIO_ID = localStorage.getItem('current_studio_id') || 'STU-001'; 
const STUDIO_TOKEN = localStorage.getItem('studio_token') || '58879@Stella';

// Inizializzazione modulo
document.addEventListener('DOMContentLoaded', () => {
    loadClienti();
    setupForm();
});

// 🔄 READ: Carica la lista completa dei clienti dallo storage JSON su R2
async function loadClienti() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        const clienti = await response.json();

        const listContainer = document.getElementById('clienti-list');
        if (!listContainer) return;

        if (Array.isArray(clienti) && clienti.length > 0) {
            listContainer.innerHTML = clienti.map(cliente => `
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
                    <h3>Nessun cliente trovato nel Cloud</h3>
                    <p>Clicca "Nuovo Cliente" per aggiungere il primo cliente</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Errore caricamento clienti:', error);
        alert('❌ Errore di sincronizzazione con lo Storage Privato.');
    }
}

// Setup ascolto modulo di inserimento
function setupForm() {
    const form = document.getElementById('cliente-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveCliente();
        });
    }
}

// Gestione visiva Modal (Invariata per le tue schede)
function openModal(cliente = null) {
    const modal = document.getElementById('cliente-modal');
    const title = document.getElementById('modal-title');
    if (!modal) return;
    
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

function closeModal() {
    const modal = document.getElementById('cliente-modal');
    if (modal) modal.classList.remove('active');
}

// 💾 CREATE & UPDATE: Salva o Aggiorna il cliente riscrivendo il file JSON
async function saveCliente() {
    const clienteIdInput = document.getElementById('cliente-id').value;
    
    // 1. Scarica la lista attuale dei clienti dal Cloud per aggiornarla
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
        nome: document.getElementById('nome').value.trim(),
        cognome: document.getElementById('cognome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        indirizzo: document.getElementById('indirizzo').value.trim(),
        note: document.getElementById('note').value.trim(),
        updated_at: new Date().toISOString()
    };

    if (clienteIdInput) {
        // Modalità Modifica: Sostituisci il vecchio record corrispondente
        const index = clienti.findIndex(c => c.id === clienteIdInput);
        if (index !== -1) {
            clienti[index] = campiCliente;
        }
    } else {
        // Modalità Nuovo Inserimento: Aggiungi in coda all'array
        clienti.push(campiCliente);
    }

    // 2. Invia l'intero array aggiornato a Cloudflare R2
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
            alert(clienteIdInput ? '✅ Record Cliente aggiornato nel Cloud!' : '✅ Nuovo Cliente salvato con successo!');
            closeModal();
            loadClienti();
        } else {
            alert('❌ Errore nel salvataggio del file: ' + (result.message || 'Rifiutato dal server'));
        }
    } catch (error) {
        console.error('Errore salvataggio:', error);
        alert('❌ Impossibile stabilire la connessione sicura.');
    }
}

// 🔍 Carica i dati del singolo cliente nel modal per permettere la modifica
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
            alert('❌ Cliente non trovato nel database Cloud.');
        }
    } catch (error) {
        console.error('Errore modifica:', error);
        alert('❌ Errore durante il recupero della scheda.');
    }
}

// 🗑️ DELETE: Rimuove un cliente dalla lista e aggiorna lo storage cloud
async function deleteCliente(clienteId) {
    if (!confirm('⚠️ Vuoi davvero eliminare questa scheda cliente? L\'azione aggiornerà il database privato.')) {
        return;
    }

    try {
        // 1. Carica l'elenco attuale
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=clienti`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        let clienti = await response.json();
        
        // Filtra escludendo il cliente rimosso
        clienti = clienti.filter(c => c.id !== clienteId);

        // 2. Risalva l'elenco ripulito su R2
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
            alert('🗑️ Scheda cliente eliminata definitivamente dal Cloud!');
            loadClienti();
        } else {
            alert('❌ Impossibile aggiornare la lista dopo l\'eliminazione.');
        }
    } catch (error) {
        console.error('Errore eliminazione:', error);
        alert('❌ Errore di rete durante la rimozione.');
    }
}
