// Configurazione
const API_URL = 'https://appcenter-api.mairaluigi.workers.dev';
const STUDIO_ID = 'STU-001'; // ID dello studio demo

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadPreventivi();
    loadClientiForSelect();
    setupForm();
});

// Carica preventivi
async function loadPreventivi() {
    try {
        const response = await fetch(`${API_URL}/api/preventivi?studio_id=${STUDIO_ID}`);
        const data = await response.json();

        const listContainer = document.getElementById('preventivi-list');

        if (data.success && data.preventivi.length > 0) {
            listContainer.innerHTML = data.preventivi.map(prev => `
                <div class="preventivo-card">
                    <div class="preventivo-header">
                        <h3 class="preventivo-titolo">${prev.titolo}</h3>
                        <div class="preventivo-importo">€${parseFloat(prev.importo).toFixed(2)}</div>
                    </div>
                    <div class="preventivo-info">
                        <p>👤 <strong>Cliente:</strong> ${prev.cliente_nome || 'N/A'} ${prev.cliente_cognome || ''}</p>
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
        const response = await fetch(`${API_URL}/api/clienti?studio_id=${STUDIO_ID}`);
        const data = await response.json();

        const select = document.getElementById('cliente-select');
        
        if (data.success && data.clienti.length > 0) {
            select.innerHTML = '<option value="">Seleziona un cliente</option>' + 
                data.clienti.map(c => `
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await savePreventivo();
    });
}

// Apri modal
function openModal() {
    const modal = document.getElementById('preventivo-modal');
    document.getElementById('modal-title').textContent = 'Nuovo Preventivo';
    document.getElementById('preventivo-form').reset();
    document.getElementById('preventivo-id').value = '';
    document.getElementById('stato').value = 'in_attesa';
    loadClientiForSelect();
    modal.classList.add('active');
}

// Chiudi modal
function closeModal() {
    const modal = document.getElementById('preventivo-modal');
    modal.classList.remove('active');
}

// Salva preventivo
async function savePreventivo() {
    const preventivoId = document.getElementById('preventivo-id').value;
    const data = {
        studio_id: STUDIO_ID,
        cliente_id: document.getElementById('cliente-select').value,
        titolo: document.getElementById('titolo').value,
        descrizione: document.getElementById('descrizione').value,
        importo: parseFloat(document.getElementById('importo').value),
        stato: document.getElementById('stato').value,
        data_scadenza: document.getElementById('data-scadenza').value
    };

    if (!data.cliente_id) {
        alert('Seleziona un cliente!');
        return;
    }

    try {
        const url = preventivoId 
            ? `${API_URL}/api/preventivi/${preventivoId}`
            : `${API_URL}/api/preventivi`;
        
        const method = preventivoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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
        // Qui dovresti avere un endpoint per ottenere un singolo preventivo
        // Per ora ricarichiamo tutti e troviamo quello giusto
        const response = await fetch(`${API_URL}/api/preventivi?studio_id=${STUDIO_ID}`);
        const data = await response.json();

        if (data.success) {
            const preventivo = data.preventivi.find(p => p.id === preventivoId);
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
