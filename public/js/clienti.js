// Configurazione
const API_URL = 'https://appcenter-api.mairaluigi.workers.dev';
const STUDIO_ID = 'STU-001'; // ID dello studio demo

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadClienti();
    setupForm();
});

// Carica lista clienti
async function loadClienti() {
    try {
        const response = await fetch(`${API_URL}/api/clienti?studio_id=${STUDIO_ID}`);
        const data = await response.json();

        const listContainer = document.getElementById('clienti-list');

        if (data.success && data.clienti.length > 0) {
            listContainer.innerHTML = data.clienti.map(cliente => `
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCliente();
    });
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
        document.getElementById('cliente-form').reset();
        document.getElementById('cliente-id').value = '';
    }
    
    modal.classList.add('active');
}

// Chiudi modal
function closeModal() {
    const modal = document.getElementById('cliente-modal');
    modal.classList.remove('active');
}

// Salva cliente
async function saveCliente() {
    const clienteId = document.getElementById('cliente-id').value;
    const data = {
        studio_id: STUDIO_ID,
        nome: document.getElementById('nome').value,
        cognome: document.getElementById('cognome').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        indirizzo: document.getElementById('indirizzo').value,
        note: document.getElementById('note').value
    };

    try {
        const url = clienteId 
            ? `${API_URL}/api/clienti/${clienteId}`
            : `${API_URL}/api/clienti`;
        
        const method = clienteId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert(clienteId ? 'Cliente aggiornato!' : 'Cliente creato!');
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
        const response = await fetch(`${API_URL}/api/clienti/${clienteId}`);
        const data = await response.json();

        if (data.success) {
            openModal(data.cliente);
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
        const response = await fetch(`${API_URL}/api/clienti/${clienteId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

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
