-- Tabella Studi Fotografici
CREATE TABLE IF NOT EXISTS studi (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    indirizzo TEXT,
    password TEXT NOT NULL,
    attivo INTEGER DEFAULT 1,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    scadenza_abbonamento DATETIME
);

-- Tabella Clienti
CREATE TABLE IF NOT EXISTS clienti (
    id TEXT PRIMARY KEY,
    studio_id TEXT NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    indirizzo TEXT,
    data_nascita TEXT,
    note TEXT,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studio_id) REFERENCES studi(id)
);

-- Tabella Preventivi
CREATE TABLE IF NOT EXISTS preventivi (
    id TEXT PRIMARY KEY,
    studio_id TEXT NOT NULL,
    cliente_id TEXT NOT NULL,
    titolo TEXT NOT NULL,
    descrizione TEXT,
    importo DECIMAL(10,2) DEFAULT 0,
    stato TEXT DEFAULT 'in_attesa',
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_scadenza DATETIME,
    FOREIGN KEY (studio_id) REFERENCES studi(id),
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);

-- Tabella Foto
CREATE TABLE IF NOT EXISTS foto (
    id TEXT PRIMARY KEY,
    studio_id TEXT NOT NULL,
    cliente_id TEXT,
    titolo TEXT,
    percorso_r2 TEXT NOT NULL,
    url_pubblica TEXT,
    categoria TEXT,
    selezionata INTEGER DEFAULT 0,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studio_id) REFERENCES studi(id),
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);

-- Tabella Contratti
CREATE TABLE IF NOT EXISTS contratti (
    id TEXT PRIMARY KEY,
    studio_id TEXT NOT NULL,
    cliente_id TEXT NOT NULL,
    tipo_servizio TEXT NOT NULL,
    data_evento TEXT,
    importo DECIMAL(10,2) DEFAULT 0,
    acconto DECIMAL(10,2) DEFAULT 0,
    saldo DECIMAL(10,2) DEFAULT 0,
    stato TEXT DEFAULT 'bozza',
    note TEXT,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studio_id) REFERENCES studi(id),
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);

-- Tabella Gallery
CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    studio_id TEXT NOT NULL,
    cliente_id TEXT NOT NULL,
    titolo TEXT NOT NULL,
    token_unico TEXT UNIQUE NOT NULL,
    data_scadenza DATETIME,
    attiva INTEGER DEFAULT 1,
    data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studio_id) REFERENCES studi(id),
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);

-- Tabella Ricevute
CREATE TABLE IF NOT EXISTS ricevute (
    id TEXT PRIMARY KEY,
    studio_id TEXT NOT NULL,
    cliente_id TEXT NOT NULL,
    tipo TEXT NOT NULL,
    importo DECIMAL(10,2) NOT NULL,
    data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento TEXT,
    note TEXT,
    FOREIGN KEY (studio_id) REFERENCES studi(id),
    FOREIGN KEY (cliente_id) REFERENCES clienti(id)
);
