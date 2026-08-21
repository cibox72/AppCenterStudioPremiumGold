// API per AppCenter Studio Premium Gold
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ==================== AUTH ====================
      if (path === '/api/login' && method === 'POST') {
        return await handleLogin(request, env);
      }

      // ==================== STUDI ====================
      if (path === '/api/studi' && method === 'GET') {
        return await handleGetStudi(request, env);
      }

      if (path === '/api/studi' && method === 'POST') {
        return await handleCreaStudio(request, env);
      }

      // ==================== CLIENTI ====================
      if (path === '/api/clienti' && method === 'GET') {
        return await handleGetClienti(request, env);
      }

      if (path === '/api/clienti' && method === 'POST') {
        return await handleCreaCliente(request, env);
      }

      if (path.startsWith('/api/clienti/') && method === 'GET') {
        const clienteId = path.split('/')[3];
        return await handleGetClienteById(clienteId, env);
      }

      if (path.startsWith('/api/clienti/') && method === 'PUT') {
        const clienteId = path.split('/')[3];
        return await handleAggiornaCliente(request, clienteId, env);
      }

      if (path.startsWith('/api/clienti/') && method === 'DELETE') {
        const clienteId = path.split('/')[3];
        return await handleEliminaCliente(clienteId, env);
      }

      return new Response(JSON.stringify({ error: 'Route non trovata' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

// ==================== HANDLERS ====================

// Login
async function handleLogin(request, env) {
  const { username, password } = await request.json();
  
  if (username === 'admin' && password === '58879@Stella') {
    return new Response(JSON.stringify({ success: true, tipo: 'admin' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const result = await env.DB.prepare(
    'SELECT id, nome, email, telefono, attivo FROM studi WHERE email = ? AND password = ? AND attivo = 1'
  ).bind(username, password).first();

  if (result) {
    return new Response(JSON.stringify({ success: true, tipo: 'studio', studio: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: false, message: 'Credenziali non valide' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get studi
async function handleGetStudi(request, env) {
  const result = await env.DB.prepare(
    'SELECT id, nome, email, telefono, indirizzo, attivo, data_creazione FROM studi ORDER BY nome'
  ).all();

  return new Response(JSON.stringify({ success: true, studi: result.results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

  return new Response(JSON.stringify({ success: true, studio_id: studioId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get clienti
async function handleGetClienti(request, env) {
  const url = new URL(request.url);
  const studio_id = url.searchParams.get('studio_id');

  const result = await env.DB.prepare(
    'SELECT * FROM clienti WHERE studio_id = ? ORDER BY cognome, nome'
  ).bind(studio_id).all();

  return new Response(JSON.stringify({ success: true, clienti: result.results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

  return new Response(JSON.stringify({ success: true, cliente_id: clienteId }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get cliente by ID
async function handleGetClienteById(clienteId, env) {
  const result = await env.DB.prepare(
    'SELECT * FROM clienti WHERE id = ?'
  ).bind(clienteId).first();

  return new Response(JSON.stringify({ success: true, cliente: result }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Aggiorna cliente
async function handleAggiornaCliente(request, clienteId, env) {
  const data = await request.json();
  
  let query = 'UPDATE clienti SET ';
  const params = [];
  
  const fields = ['nome', 'cognome', 'email', 'telefono', 'indirizzo', 'data_nascita', 'note'];
  fields.forEach(field => {
    if (data[field] !== undefined) {
      query += `${field} = ?, `;
      params.push(data[field]);
    }
  });
  
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  params.push(clienteId);

  await env.DB.prepare(query).bind(...params).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Elimina cliente
async function handleEliminaCliente(clienteId, env) {
  await env.DB.prepare('DELETE FROM clienti WHERE id = ?').bind(clienteId).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
