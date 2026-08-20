// API per AppCenter Studio Premium Gold
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers per permettere chiamate dal frontend
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Gestione preflight OPTIONS
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ==================== AUTH ====================
      
      // Login
      if (path === '/api/login' && method === 'POST') {
        return await handleLogin(request, env);
      }

      // ==================== STUDI ====================
      
      // Lista tutti gli studi (admin)
      if (path === '/api/studi' && method === 'GET') {
        return await handleGetStudi(request, env);
      }

      // Crea nuovo studio (admin)
      if (path === '/api/studi' && method === 'POST') {
        return await handleCreaStudio(request, env);
      }

      // Dettagli studio specifico
      if (path.startsWith('/api/studi/') && method === 'GET') {
        const studioId = path.split('/')[3];
        return await handleGetStudioById(studioId, env);
      }

      // Aggiorna studio
      if (path.startsWith('/api/studi/') && method === 'PUT') {
        const studioId = path.split('/')[3];
        return await handleAggiornaStudio(request, studioId, env);
      }

      // Elimina studio
      if (path.startsWith('/api/studi/') && method === 'DELETE') {
        const studioId = path.split('/')[3];
        return await handleEliminaStudio(studioId, env);
      }

      // Attiva/Disattiva studio
      if (path === '/api/studi/toggle-attivo' && method === 'POST') {
        return await handleToggleAttivo(request, env);
      }

      // ==================== CLIENTI ====================
      
      // Lista clienti di uno studio
      if (path === '/api/clienti' && method === 'GET') {
        return await handleGetClienti(request, env);
      }

      // Crea cliente
      if (path === '/api/clienti' && method === 'POST') {
        return await handleCreaCliente(request, env);
      }

      // Dettagli cliente
      if (path.startsWith('/api/clienti/') && method === 'GET') {
        const clienteId = path.split('/')[3];
        return await handleGetClienteById(clienteId, env);
      }

      // Aggiorna cliente
      if (path.startsWith('/api/clienti/') && method === 'PUT') {
        const clienteId = path.split('/')[3];
        return await handleAggiornaCliente(request, clienteId, env);
      }

      // Elimina cliente
      if (path.startsWith('/api/clienti/') && method === 'DELETE') {
        const clienteId = path.split('/')[3];
        return await handleEliminaCliente(clienteId, env);
      }

      // ==================== PREVENTIVI ====================
      
      // Lista preventivi
      if (path === '/api/preventivi' && method === 'GET') {
        return await handleGetPreventivi(request, env);
      }

      // Crea preventivo
      if (path === '/api/preventivi' && method === 'POST') {
        return await handleCreaPreventivo(request, env);
      }

      // Aggiorna preventivo
      if (path.startsWith('/api/preventivi/') && method === 'PUT') {
        const preventivoId = path.split('/')[3];
        return await handleAggiornaPreventivo(request, preventivoId, env);
      }

      // ==================== FOTO ====================
      
      // Lista foto
      if (path === '/api/foto' && method === 'GET') {
        return await handleGetFoto(request, env);
      }

      // Upload foto su R2
      if (path === '/api/foto/upload' && method === 'POST') {
        return await handleUploadFoto(request, env);
      }

      // Seleziona/Deseleziona foto
      if (path === '/api/foto/toggle-selezionata' && method === 'POST') {
        return await handleToggleSelezionata(request, env);
      }

      // Elimina foto
      if (path.startsWith('/api/foto/') && method === 'DELETE') {
        const fotoId = path.split('/')[3];
        return await handleEliminaFoto(fotoId, env);
      }

      // ==================== GALLERY ====================
      
      // Crea gallery per cliente
      if (path === '/api/gallery' && method === 'POST') {
        return await handleCreaGallery(request, env);
      }

      // Lista gallery
      if (path === '/api/gallery' && method === 'GET') {
        return await handleGetGallery(request, env);
      }

      // Gallery pubblica (senza auth)
      if (path.startsWith('/api/gallery/public/') && method === 'GET') {
        const token = path.split('/')[4];
        return await handleGalleryPubblica(token, env);
      }

      // ==================== CONTRATTI ====================
      
      // Lista contratti
      if (path === '/api/contratti' && method === 'GET') {
        return await handleGetContratti(request, env);
      }

      // Crea contratto
      if (path === '/api/contratti' && method === 'POST') {
        return await handleCreaContratto(request, env);
      }

      // Aggiorna contratto
      if (path.startsWith('/api/contratti/') && method === 'PUT') {
        const contrattoId = path.split('/')[3];
        return await handleAggiornaContratto(request, contrattoId, env);
      }

      // ==================== RICEVUTE ====================
      
      // Lista ricevute
      if (path === '/api/ricevute' && method === 'GET') {
        return await handleGetRicevute(request, env);
      }

      // Crea ricevuta
      if (path === '/api/ricevute' && method === 'POST') {
        return await handleCreaRicevuta(request, env);
      }

      // ==================== BACKUP ====================
      
      // Esegui backup manuale
      if (path === '/api/backup' && method === 'POST') {
        return await handleBackup(request, env);
      }

      // Lista backup
      if (path === '/api/backup/lista' && method === 'GET') {
        return await handleListaBackup(request, env);
      }

      // Ripristina backup
      if (path === '/api/backup/ripristina' && method === 'POST') {
        return await handleRipristino(request, env);
      }

      // ==================== CONFIGURAZIONI ====================
      
      // Get configurazione studio
      if (path === '/api/configurazione' && method === 'GET') {
        return await handleGetConfigurazione(request, env);
      }

      // Aggiorna configurazione
      if (path === '/api/configurazione' && method === 'PUT') {
        return await handleAggiornaConfigurazione(request, env);
      }

      // ==================== LOG ====================
      
      // Lista log operazioni
      if (path === '/api/log' && method === 'GET') {
        return await handleGetLog(request, env);
      }

      // Route non trovata
      return new Response(JSON.stringify({ error: 'Route non trovata' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Errore API:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

// ==================== FUNZIONI HANDLER ====================

// Login
async function handleLogin(request, env) {
  const { username, password } = await request.json();
  
  // Login admin
  if (username === 'admin' && password === '58879@Stella') {
    return new Response(JSON.stringify({ 
      success: true, 
      tipo: 'admin',
      redirect: '/admin'
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Login studio
  const result = await env.DB.prepare(
    'SELECT id, nome, email, telefono, attivo FROM studi WHERE email = ? AND password = ? AND attivo = 1'
  ).bind(username, password).first();

  if (result) {
    return new Response(JSON.stringify({ 
      success: true, 
      tipo: 'studio',
      studio: result
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ 
    success: false, 
    message: 'Credenziali non valide' 
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get tutti gli studi
async function handleGetStudi(request, env) {
  const result = await env.DB.prepare(
    'SELECT id, nome, email, telefono, indirizzo, attivo, data_creazione FROM studi ORDER BY nome'
  ).all();

  return new Response(JSON.stringify({ 
    success: true, 
    studi: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Crea studio
async function handleCreaStudio(request, env) {
  const { nome, email, telefono, indirizzo, password } = await request.json();
  const studioId = 'STU-' + Date.now();

  await env.DB.prepare(
    `INSERT INTO studi (id, nome, email, telefono, indirizzo, password, attivo)
     VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).bind(studioId, nome, email, telefono, indirizzo, password).run();

  // Log operazione
  await logOperazione(env, null, 'admin', 'crea_studio', `Creato studio: ${nome}`);

  return new Response(JSON.stringify({ 
    success: true, 
    studio_id: studioId,
    message: 'Studio creato con successo'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get studio by ID
async function handleGetStudioById(studioId, env) {
  const result = await env.DB.prepare(
    'SELECT * FROM studi WHERE id = ?'
  ).bind(studioId).first();

  if (!result) {
    return new Response(JSON.stringify({ error: 'Studio non trovato' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    studio: result
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Aggiorna studio
async function handleAggiornaStudio(request, studioId, env) {
  const { nome, email, telefono, indirizzo, password } = await request.json();
  
  let query = 'UPDATE studi SET ';
  const params = [];
  
  if (nome) {
    query += 'nome = ?, ';
    params.push(nome);
  }
  if (email) {
    query += 'email = ?, ';
    params.push(email);
  }
  if (telefono) {
    query += 'telefono = ?, ';
    params.push(telefono);
  }
  if (indirizzo) {
    query += 'indirizzo = ?, ';
    params.push(indirizzo);
  }
  if (password) {
    query += 'password = ?, ';
    params.push(password);
  }
  
  query = query.slice(0, -2); // Rimuovi ultima virgola
  query += ' WHERE id = ?';
  params.push(studioId);

  await env.DB.prepare(query).bind(...params).run();

  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Studio aggiornato'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Elimina studio
async function handleEliminaStudio(studioId, env) {
  await env.DB.prepare('DELETE FROM studi WHERE id = ?').bind(studioId).run();
  
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Studio eliminato'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Toggle attivo/disattivo studio
async function handleToggleAttivo(request, env) {
  const { studio_id, attivo } = await request.json();
  
  await env.DB.prepare(
    'UPDATE studi SET attivo = ? WHERE id = ?'
  ).bind(attivo ? 1 : 0, studio_id).run();

  return new Response(JSON.stringify({ 
    success: true, 
    message: `Studio ${attivo ? 'attivato' : 'disattivato'}`
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get clienti
async function handleGetClienti(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');

  const result = await env.DB.prepare(
    'SELECT * FROM clienti WHERE studio_id = ? ORDER BY cognome, nome'
  ).bind(studio_id).all();

  return new Response(JSON.stringify({ 
    success: true, 
    clienti: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Crea cliente
async function handleCreaCliente(request, env) {
  const { studio_id, nome, cognome, email, telefono, indirizzo, data_nascita, note } = await request.json();
  const clienteId = 'CLI-' + Date.now();

  await env.DB.prepare(
    `INSERT INTO clienti (id, studio_id, nome, cognome, email, telefono, indirizzo, data_nascita, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(clienteId, studio_id, nome, cognome, email, telefono, indirizzo, data_nascita, note).run();

  return new Response(JSON.stringify({ 
    success: true, 
    cliente_id: clienteId
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get cliente by ID
async function handleGetClienteById(clienteId, env) {
  const result = await env.DB.prepare(
    'SELECT * FROM clienti WHERE id = ?'
  ).bind(clienteId).first();

  return new Response(JSON.stringify({ 
    success: true, 
    cliente: result
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Aggiorna cliente
async function handleAggiornaCliente(request, clienteId, env) {
  const data = await request.json();
  
  let query = 'UPDATE clienti SET ';
  const params = [];
  
  const fields = ['nome', 'cognome', 'email', 'telefono', 'indirizzo', 'data_nascita', 'note'];
  fields.forEach(field => {
    if (data[field]) {
      query += `${field} = ?, `;
      params.push(data[field]);
    }
  });
  
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  params.push(clienteId);

  await env.DB.prepare(query).bind(...params).run();

  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Elimina cliente
async function handleEliminaCliente(clienteId, env) {
  await env.DB.prepare('DELETE FROM clienti WHERE id = ?').bind(clienteId).run();
  
  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get preventivi
async function handleGetPreventivi(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');
  const cliente_id = url.searchParams.get('cliente_id');

  let query = `
    SELECT p.*, c.nome as cliente_nome, c.cognome as cliente_cognome 
    FROM preventivi p 
    LEFT JOIN clienti c ON p.cliente_id = c.id 
    WHERE p.studio_id = ?
  `;
  const params = [studio_id];

  if (cliente_id) {
    query += ' AND p.cliente_id = ?';
    params.push(cliente_id);
  }

  query += ' ORDER BY p.data_creazione DESC';

  const result = await env.DB.prepare(query).bind(...params).all();

  return new Response(JSON.stringify({ 
    success: true, 
    preventivi: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Crea preventivo
async function handleCreaPreventivo(request, env) {
  const { studio_id, cliente_id, titolo, descrizione, importo, data_scadenza } = await request.json();
  const preventivoId = 'PRE-' + Date.now();

  await env.DB.prepare(
    `INSERT INTO preventivi (id, studio_id, cliente_id, titolo, descrizione, importo, data_scadenza)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(preventivoId, studio_id, cliente_id, titolo, descrizione, importo, data_scadenza).run();

  return new Response(JSON.stringify({ 
    success: true, 
    preventivo_id: preventivoId
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Aggiorna preventivo
async function handleAggiornaPreventivo(request, preventivoId, env) {
  const data = await request.json();
  
  let query = 'UPDATE preventivi SET ';
  const params = [];
  
  const fields = ['titolo', 'descrizione', 'importo', 'stato', 'data_scadenza'];
  fields.forEach(field => {
    if (data[field] !== undefined) {
      query += `${field} = ?, `;
      params.push(data[field]);
    }
  });
  
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  params.push(preventivoId);

  await env.DB.prepare(query).bind(...params).run();

  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get foto
async function handleGetFoto(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');
  const cliente_id = url.searchParams.get('cliente_id');
  const selezionata = url.searchParams.get('selezionata');

  let query = 'SELECT * FROM foto WHERE studio_id = ?';
  const params = [studio_id];

  if (cliente_id) {
    query += ' AND cliente_id = ?';
    params.push(cliente_id);
  }
  
  if (selezionata !== null) {
    query += ' AND selezionata = ?';
    params.push(parseInt(selezionata));
  }

  query += ' ORDER BY data_upload DESC';

  const result = await env.DB.prepare(query).bind(...params).all();

  return new Response(JSON.stringify({ 
    success: true, 
    foto: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Upload foto su R2
async function handleUploadFoto(request, env) {
  const formData = await request.formData();
  const file = formData.get('file');
  const studio_id = formData.get('studio_id');
  const cliente_id = formData.get('cliente_id');
  const titolo = formData.get('titolo') || file.name;
  const categoria = formData.get('categoria') || 'generiche';

  if (!file) {
    return new Response(JSON.stringify({ error: 'Nessun file fornito' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Genera nome file unico
  const timestamp = Date.now();
  const fileName = `${studio_id}/${categoria}/${timestamp}_${file.name}`;

  // Upload su R2
  await env.FOTO_BUCKET.put(fileName, file, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  // Genera URL pubblica
  const urlPubblica = `https://appcenter-studio-foto.r2.dev/${fileName}`;

  // Salva metadata nel database
  const fotoId = 'FOTO-' + timestamp;
  await env.DB.prepare(
    `INSERT INTO foto (id, studio_id, cliente_id, titolo, percorso_r2, url_pubblica, categoria)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(fotoId, studio_id, cliente_id, titolo, fileName, urlPubblica, categoria).run();

  return new Response(JSON.stringify({ 
    success: true, 
    foto_id: fotoId,
    url: urlPubblica
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Toggle foto selezionata
async function handleToggleSelezionata(request, env) {
  const { foto_id, selezionata } = await request.json();
  
  await env.DB.prepare(
    'UPDATE foto SET selezionata = ? WHERE id = ?'
  ).bind(selezionata ? 1 : 0, foto_id).run();

  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Elimina foto
async function handleEliminaFoto(fotoId, env) {
  // Prima ottieni il percorso R2
  const foto = await env.DB.prepare(
    'SELECT percorso_r2 FROM foto WHERE id = ?'
  ).bind(fotoId).first();

  if (foto) {
    // Elimina da R2
    await env.FOTO_BUCKET.delete(foto.percorso_r2);
    
    // Elimina dal database
    await env.DB.prepare('DELETE FROM foto WHERE id = ?').bind(fotoId).run();
  }

  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Crea gallery
async function handleCreaGallery(request, env) {
  const { studio_id, cliente_id, titolo, giorni_scadenza } = await request.json();
  const galleryId = 'GAL-' + Date.now();
  const tokenUnico = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  const dataScadenza = new Date(Date.now() + (giorni_scadenza || 7) * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(
    `INSERT INTO gallery (id, studio_id, cliente_id, titolo, token_unico, data_scadenza, attiva)
     VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).bind(galleryId, studio_id, cliente_id, titolo, tokenUnico, dataScadenza).run();

  const urlPubblica = `https://appcentersudiopremiumgold.pages.dev/gallery/${tokenUnico}`;

  return new Response(JSON.stringify({ 
    success: true, 
    gallery_id: galleryId,
    token: tokenUnico,
    url: urlPubblica
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get gallery
async function handleGetGallery(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');

  const result = await env.DB.prepare(
    `SELECT g.*, c.nome as cliente_nome, c.cognome as cliente_cognome 
     FROM gallery g 
     LEFT JOIN clienti c ON g.cliente_id = c.id 
     WHERE g.studio_id = ? 
     ORDER BY g.data_creazione DESC`
  ).bind(studio_id).all();

  return new Response(JSON.stringify({ 
    success: true, 
    gallery: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Gallery pubblica (senza auth)
async function handleGalleryPubblica(token, env) {
  const gallery = await env.DB.prepare(
    `SELECT g.*, s.nome as studio_nome 
     FROM gallery g 
     JOIN studi s ON g.studio_id = s.id 
     WHERE g.token_unico = ? AND g.attiva = 1`
  ).bind(token).first();

  if (!gallery) {
    return new Response(JSON.stringify({ error: 'Gallery non trovata o scaduta' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verifica scadenza
  if (new Date(gallery.data_scadenza) < new Date()) {
    return new Response(JSON.stringify({ error: 'Gallery scaduta' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Ottieni foto selezionate per questa gallery
  const foto = await env.DB.prepare(
    'SELECT * FROM foto WHERE studio_id = ? AND cliente_id = ? AND selezionata = 1'
  ).bind(gallery.studio_id, gallery.cliente_id).all();

  return new Response(JSON.stringify({ 
    success: true, 
    gallery: gallery,
    foto: foto.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get contratti
async function handleGetContratti(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');
  const cliente_id = url.searchParams.get('cliente_id');

  let query = 'SELECT * FROM contratti WHERE studio_id = ?';
  const params = [studio_id];

  if (cliente_id) {
    query += ' AND cliente_id = ?';
    params.push(cliente_id);
  }

  query += ' ORDER BY data_creazione DESC';

  const result = await env.DB.prepare(query).bind(...params).all();

  return new Response(JSON.stringify({ 
    success: true, 
    contratti: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Crea contratto
async function handleCreaContratto(request, env) {
  const { studio_id, cliente_id, tipo_servizio, data_evento, importo, acconto, note } = await request.json();
  const contrattoId = 'CON-' + Date.now();
  const saldo = (importo || 0) - (acconto || 0);

  await env.DB.prepare(
    `INSERT INTO contratti (id, studio_id, cliente_id, tipo_servizio, data_evento, importo, acconto, saldo, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(contrattoId, studio_id, cliente_id, tipo_servizio, data_evento, importo, acconto, saldo, note).run();

  return new Response(JSON.stringify({ 
    success: true, 
    contratto_id: contrattoId
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Aggiorna contratto
async function handleAggiornaContratto(request, contrattoId, env) {
  const data = await request.json();
  
  let query = 'UPDATE contratti SET ';
  const params = [];
  
  const fields = ['tipo_servizio', 'data_evento', 'importo', 'acconto', 'saldo', 'stato', 'note'];
  fields.forEach(field => {
    if (data[field] !== undefined) {
      query += `${field} = ?, `;
      params.push(data[field]);
    }
  });
  
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  params.push(contrattoId);

  await env.DB.prepare(query).bind(...params).run();

  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get ricevute
async function handleGetRicevute(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');
  const cliente_id = url.searchParams.get('cliente_id');

  let query = 'SELECT * FROM ricevute WHERE studio_id = ?';
  const params = [studio_id];

  if (cliente_id) {
    query += ' AND cliente_id = ?';
    params.push(cliente_id);
  }

  query += ' ORDER BY data_pagamento DESC';

  const result = await env.DB.prepare(query).bind(...params).all();

  return new Response(JSON.stringify({ 
    success: true, 
    ricevute: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Crea ricevuta
async function handleCreaRicevuta(request, env) {
  const { studio_id, cliente_id, tipo, importo, metodo_pagamento, note } = await request.json();
  const ricevutaId = 'RIC-' + Date.now();

  await env.DB.prepare(
    `INSERT INTO ricevute (id, studio_id, cliente_id, tipo, importo, metodo_pagamento, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(ricevutaId, studio_id, cliente_id, tipo, importo, metodo_pagamento, note).run();

  return new Response(JSON.stringify({ 
    success: true, 
    ricevuta_id: ricevutaId
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Backup manuale
async function handleBackup(request, env) {
  const { studio_id, tipo } = await request.json();
  const backupId = 'BACKUP-' + Date.now();
  const dataCreazione = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO backup (id, studio_id, tipo, stato, data_creazione)
     VALUES (?, ?, ?, 'completato', ?)`
  ).bind(backupId, studio_id, tipo || 'manuale', dataCreazione).run();

  await logOperazione(env, studio_id, 'sistema', 'backup', `Backup ${tipo || 'manuale'} completato`);

  return new Response(JSON.stringify({ 
    success: true, 
    backup_id: backupId,
    message: 'Backup completato'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Lista backup
async function handleListaBackup(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');

  const result = await env.DB.prepare(
    'SELECT * FROM backup WHERE studio_id = ? ORDER BY data_creazione DESC LIMIT 50'
  ).bind(studio_id).all();

  return new Response(JSON.stringify({ 
    success: true, 
    backup: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Ripristino
async function handleRipristino(request, env) {
  const { backup_id, studio_id } = await request.json();

  const backup = await env.DB.prepare(
    'SELECT * FROM backup WHERE id = ? AND studio_id = ?'
  ).bind(backup_id, studio_id).first();

  if (!backup) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Backup non trovato'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await logOperazione(env, studio_id, 'sistema', 'ripristino', `Ripristino da backup ${backup_id}`);

  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Ripristino completato'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get configurazione
async function handleGetConfigurazione(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');
  const chiave = url.searchParams.get('chiave');

  let query = 'SELECT * FROM configurazioni WHERE studio_id = ?';
  const params = [studio_id];

  if (chiave) {
    query += ' AND chiave = ?';
    params.push(chiave);
  }

  const result = await env.DB.prepare(query).bind(...params).all();

  return new Response(JSON.stringify({ 
    success: true, 
    configurazioni: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Aggiorna configurazione
async function handleAggiornaConfigurazione(request, env) {
  const { studio_id, chiave, valore, descrizione } = await request.json();
  const configId = 'CONF-' + Date.now();

  await env.DB.prepare(
    `INSERT OR REPLACE INTO configurazioni (id, studio_id, chiave, valore, descrizione, data_modifica)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).bind(configId, studio_id, chiave, valore, descrizione).run();

  return new Response(JSON.stringify({ 
    success: true 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get log operazioni
async function handleGetLog(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');

  let query = 'SELECT * FROM log_operazioni WHERE 1=1';
  const params = [];

  if (studio_id) {
    query += ' AND studio_id = ?';
    params.push(studio_id);
  }

  query += ' ORDER BY data_operazione DESC LIMIT 100';

  const result = await env.DB.prepare(query).bind(...params).all();

  return new Response(JSON.stringify({ 
    success: true, 
    log: result.results
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Funzione utility per log operazioni
async function logOperazione(env, studio_id, utente, operazione, dettagli) {
  const logId = 'LOG-' + Date.now();
  await env.DB.prepare(
    `INSERT INTO log_operazioni (id, studio_id, utente, operazione, dettagli)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(logId, studio_id, utente, operazione, dettagli).run();
}
