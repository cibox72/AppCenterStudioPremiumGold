// =========================================================================
// APPCENTER STUDIO PREMIUM GOLD - MODULO 04 & 05 GALLERY & GRU ENGINE v15
// =========================================================================

// 🌐 Configurazione Nuova Infrastruttura Cloudflare Privata
const API_URL = 'https://workers.dev';
const STUDIO_ID = localStorage.getItem('current_studio_id') || 'STU-001'; 
const STUDIO_TOKEN = localStorage.getItem('studio_token') || '58879@Stella';

let fotoGalleryLocali = [];
let fotoSelezionateCuoricini = [];

// 📸 Carica l'elenco delle immagini in bassa risoluzione caricate per lo specifico cliente
async function caricaGalleriaStudioCloud(clienteId) {
    if (!clienteId) return;
    try {
        const res = await fetch(`${API_URL}/api/get-gallery?studio_id=${STUDIO_ID}&cliente_id=${clienteId}`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        const data = await res.json();
        
        if (data.success) {
            fotoGalleryLocali = data.foto; // Riceve i file mantenendo i nomi originali esatti da R2
            await caricaSelezioneCuoriciniCloud(clienteId);
            renderizzaGrigliaFotoStudio();
        }
    } catch (error) {
        console.error('Errore caricamento galleria cloud:', error);
        alert('❌ Errore durante il recupero delle immagini dal server privato.');
    }
}

// 💾 Legge dal Cloud R2 l'elenco dei cuoricini già salvati per questo cliente
async function caricaSelezioneCuoriciniCloud(clienteId) {
    try {
        const res = await fetch(`${API_URL}/api/db-load?studio_id=${STUDIO_ID}&chiave=selezione_${clienteId}`, {
            method: 'GET',
            headers: { 'X-Studio-Token': STUDIO_TOKEN }
        });
        fotoSelezionateCuoricini = await res.json();
        if (!Array.isArray(fotoSelezionateCuoricini)) {
            fotoSelezionateCuoricini = [];
        }
    } catch (e) {
        fotoSelezionateCuoricini = [];
    }
}

// ❤️ Il Cliente da casa clicca sul cuoricino e aggiorna la sua lista protetta su R2
async function toggleCuoricinoCliente(nomeFoto, clienteId) {
    if (!clienteId || !nomeFoto) return;
    
    const index = fotoSelezionateCuoricini.indexOf(nomeFoto);
    if (index === -1) {
        fotoSelezionateCuoricini.push(nomeFoto); // Inserisce il nome file originale (es: DSC_1234.jpg)
    } else {
        fotoSelezionateCuoricini.splice(index, 1); // Lo rimuove se disattivato
    }
    
    // Scrittura immediata ed ultra-leggera dell'array su R2 (Zero crash)
    try {
        await fetch(`${API_URL}/api/db-save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Studio-Token': STUDIO_TOKEN 
            },
            body: JSON.stringify({
                studio_id: STUDIO_ID,
                chiave: `selezione_${clienteId}`,
                dati: fotoSelezionateCuoricini
            })
        });
    } catch (error) {
        console.error('Errore salvataggio cuoricino:', error);
    }
}

// 🖨️ INFALLIBILE: Generazione istantanea del file .txt pulito per la tua GRU
function scaricaFileTestoPerGru(clienteId) {
    if (fotoSelezionateCuoricini.length === 0) {
        alert('⚠️ Nessuna fotografia è stata selezionata con il cuoricino da questo cliente.');
        return;
    }

    // Incolla i nomi dei file originali uno sotto l'altro separati da un a capo pulito
    const testoContenuto = fotoSelezionateCuoricini.join('\n');
    
    const blob = new Blob([testoContenuto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GRU_selezione_${clienteId}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`✓ File di configurazione per la tua GRU esportato con successo!\nTotale immagini rilevate: ${fotoSelezionateCuoricini.length}\nPuoi darlo in pasto al tuo PC.`);
}

// Genera i blocchi visivi delle immagini mantenendo lo stile della suite
function renderizzaGrigliaFotoStudio() {
    const container = document.getElementById('gallery-grid-container');
    if (!container) return;

    if (fotoGalleryLocali.length > 0) {
        container.innerHTML = fotoGalleryLocali.map(f => {
            const isScelta = fotoSelezionateCuoricini.includes(f.name);
            return `
                <div class="foto-card" style="position:relative; margin:10px; display:inline-block; background:rgba(52, 73, 94, 0.4); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
                    <span style="position:absolute; top:10px; left:10px; font-size:1.5em; cursor:pointer;">${isScelta ? '❤️' : '🤍'}</span>
                    <p style="color:#ecf0f1; font-size:0.85em; text-align:center; margin-top:5px; font-family:inherit;">${f.name}</p>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = '<div class="empty-state"><h3>Nessuna foto presente in questa galleria</h3></div>';
    }
}
