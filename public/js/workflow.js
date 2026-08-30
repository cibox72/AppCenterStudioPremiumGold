// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MODULO 03 WORKFLOW GESTIONE LAVORI v15
// =========================================================================

const API_URL = 'https://workers.dev';
const STUDIO_ID = localStorage.getItem('current_studio_id') || 'STU-001'; 
const STUDIO_TOKEN = localStorage.getItem('studio_token') || '58879@Stella';

let workflowGlobali = [];

document.addEventListener('DOMContentLoaded', () => {
    caricaWorkflowCloud();
});

async function caricaWorkflowCloud() {
    try {
        const response = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=workflow`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            }
        });
        workflowGlobali = await response.json();
        
        if (!Array.isArray(workflowGlobali)) {
            workflowGlobali = [];
        }
        
        renderizzaWorkflowTabella();
    } catch (error) {
        console.error('Errore caricamento workflow:', error);
        alert('Errore di sincronizzazione workflow cloud.');
    }
}

function renderizzaWorkflowTabella() {
    const container = document.getElementById('workflow-list');
    if (!container) return;

    if (workflowGlobali.length > 0) {
        container.innerHTML = workflowGlobali.map(w => `
            <div class="cliente-card" style="border-left: 5px solid ${w.consegnato ? '#2ecc71' : '#f1c40f'};">
                <div class="cliente-info">
                    <h3>Lavoro #${w.id} - ID Cliente: ${w.cliente_id}</h3>
                    <p>📸 Stato Foto: <strong>${w.stato_foto || 'In lavorazione'}</strong> | 🎥 Stato Video: <strong>${w.stato_video || 'In lavorazione'}</strong></p>
                    <p>Fase Corrente: Step ${w.step_attuale || 1} / 05</p>
                </div>
                <div class="cliente-actions">
                    <button class="btn btn-primary" onclick="avanzaWorkflowCloud('${w.id}')">Avanza Step</button>
                    <button class="btn ${w.consegnato ? 'btn-success' : 'btn-danger'}" onclick="toggleConsegnaCloud('${w.id}')">
                        ${w.consegnato ? '✓ Consegnato' : '📁 Archivia Consegna'}
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nessun flusso di lavoro attivo</h3>
                <p>Configura un nuovo servizio per monitorare lo stato delle lavorazioni</p>
            </div>
        `;
    }
}

async function avanzaWorkflowCloud(id) {
    const index = workflowGlobali.findIndex(w => w.id === id);
    if (index !== -1) {
        let step = parseInt(workflowGlobali[index].step_attuale) || 1;
        if (step < 5) {
            step++;
        }
        workflowGlobali[index].step_attuale = step;
        
        if (step === 5) {
            workflowGlobali[index].stato_foto = 'Pronto per consegna';
            workflowGlobali[index].stato_video = 'Pronto per consegna';
        }
        
        await salvaWorkflowCloud();
    }
}

async function toggleConsegnaCloud(id) {
    const index = workflowGlobali.findIndex(w => w.id === id);
    if (index !== -1) {
        workflowGlobali[index].consegnato = !workflowGlobali[index].consegnato;
        await salvaWorkflowCloud();
    }
}

async function salvaWorkflowCloud() {
    try {
        const response = await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN
            },
            body: JSON.stringify({
                studio_id: STUDIO_ID,
                chiave: 'workflow',
                dati: workflowGlobali
            })
        });

        const result = await response.json();
        if (result.success) {
            caricaWorkflowCloud();
        } else {
            alert('Errore nel salvataggio del flusso di lavoro.');
        }
    } catch (error) {
        console.error('Errore di connessione:', error);
        alert('Impossibile connettersi al Cloud.');
    }
}
