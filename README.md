# Pricelist Manager

**Progetto di Tirocinio Universitario - Laurea Triennale**

Sistema di gestione prodotti e listini prezzi per le aziende del gruppo Planetel S.p.A.

## 📋 Indice

- [Descrizione](#descrizione)
- [Tecnologie Utilizzate](#tecnologie-utilizzate)
- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [API](#api)
- [Struttura del Progetto](#struttura-del-progetto)
- [Licenza](#licenza)

## 📖 Descrizione

Pricelist Manager è un'applicazione web sviluppata durante il tirocinio universitario per la gestione centralizzata di prodotti e listini prezzi per tutte le aziende appartenenti al gruppo Planetel S.p.A.

Il sistema permette di:

- Gestire il catalogo prodotti delle diverse aziende
- Creare e mantenere listini prezzi aggiornati
- Monitorare le variazioni di prezzo / costo dei prodotti nel tempo
- Gestire gli utenti di ogni azienda
- Gestire le varie aziende del gruppo
- Gestire delle "Liste di aggiornamento" per tener traccia dei prodotti aggiornati
- Importare/esportare dati tramite CSV

## 🛠 Tecnologie Utilizzate

### Backend

- **ASP.NET Core 8.0** - Framework web
- **Entity Framework Core** - ORM per database
- **SQL Server** - Database relazionale
- **JWT Authentication** - Sistema di autenticazione
- **Swagger/OpenAPI** - Documentazione API
- **Versioning API** - Gestione versioni API

### Frontend

- **React 19** - Framework JavaScript
- **TypeScript** - Linguaggio tipizzato
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Query** - Gestione stato server
- **React Hook Form** - Gestione form
- **React Router** - Routing
- **Recharts** - Grafici e visualizzazioni

## 📋 Prerequisiti

- **Visual Studio 2022** o **Visual Studio Code**
- **.NET 8.0 SDK**
- **Node.js 18+** e **npm**
- **SQL Server** (LocalDB, Express, o Full)

## 🚀 Installazione

### Opzione 1: Utilizzo di Visual Studio

1. **Clona il repository:**

   ```bash
   git clone https://github.com/LucaMonetti/stage-project.git
   cd stage-project
   ```

2. **Apri la solution:**

   - Apri `pricelist-manager.sln` con Visual Studio 2022
   - Il progetto dovrebbe caricarsi automaticamente con entrambi i progetti (Server e Client)

3. **Configura il database:**

   - Modifica la connection string in `appsettings.json` (vedi [Configurazione](#configurazione))

4. **Installa dipendenze del client:**

   - Visual Studio dovrebbe installarle automaticamente
   - In alternativa, apri un terminale nella cartella `pricelist-manager.client` ed esegui: `npm install`

5. **Avvia l'applicazione:**
   - Imposta come progetto di avvio: `pricelist-manager.Server`
   - Premi F5 o usa il pulsante "Start"

### Opzione 2: Utilizzo della Command Line

1. **Clona e naviga nel progetto:**

   ```powershell
   git clone https://github.com/LucaMonetti/stage-project.git
   cd stage-project
   ```

2. **Configura il backend:**

- Modifica la connection string in `appsettings.json` (vedi [Configurazione](#configurazione))

3. **Avvia l'applicazione:**

   ```powershell
   cd pricelist-manager.Server
   dotnet run --launch-profile "https"
   ```

## ⚙️ Configurazione

### Database

Modifica il file `pricelist-manager.Server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=TUO_SERVER;Initial Catalog=pricelist-manager;Integrated Security=True;Trust Server Certificate=True"
  },
  "Jwt": {
    "Issuer": "pricelist-manager",
    "ExpiryMinutes": 3600,
    "Key": "LA_TUA_CHIAVE_SEGRETA_DI_ALMENO_32_CARATTERI"
  }
}
```

Per generare una chiave è possibile utilizzare il seguente comando:

```powershell
openssl rand -base64 32
```

### Parametri Principali

| Parametro                             | Descrizione                               | Esempio                                                                            |
| ------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `ConnectionStrings:DefaultConnection` | Stringa di connessione SQL Server         | `Data Source=localhost;Initial Catalog=pricelist-manager;Integrated Security=True` |
| `Jwt:Key`                             | Chiave segreta per JWT (min 32 caratteri) | `PdOvHQ9Sf6hAHXA3KHUT41pQOhIs/tT9IqGj0p9hU8U=`                                     |
| `Jwt:ExpiryMinutes`                   | Durata token in minuti                    | `3600`                                                                             |
| `Jwt:Issuer`                          | Emittente del token                       | `pricelist-manager`                                                                |

## 🔌 API

L'API REST è documentata tramite Swagger e supporta il versioning:

- **Base URL:** `https://localhost:7187/api/v1/` oppure `http://localhost:5297/api/v1/`
- **Documentazione:** `https://localhost:7187/swagger` oppure `http://localhost:5297/api/v1/`
- **Autenticazione:** Bearer Token (JWT)

## 📁 Struttura del Progetto

```
stage-project/
├── pricelist-manager.Server/          # Backend ASP.NET Core
│   ├── Controllers/                   # Controller API
│   ├── Data/                          # Context Entity Framework
│   ├── DTOs/                          # Data Transfer Objects
│   ├── Exceptions/                    # Eccezioni
│   ├── Helpers/                       # Funzioni Utility
│   ├── Interfaces/                    # Interfacce Repository e Servizi
│   ├── Mappers/                       # Mapping tra entità e DTO
│   ├── Middlewares/                   # Middlewares
│   ├── Migrations/                    # Database Migrations
│   ├── Models/                        # Modelli database
│   └── Repositories/                  # Pattern Repository
│
├── pricelist-manager.client/          # Frontend React
│   ├── src/
│   │   ├── assets/                    # Asset Statici
│   │   ├── components/                # Componenti riutilizzabili
│   │   ├── config/                    # Configurazioni
│   │   ├── helpers/                   # Funzioni utility
│   │   ├── hooks/                     # Custom hooks
│   │   ├── models/                    # Modelli TypeScript
│   │   └── views/                     # Pagine dell'applicazione
│   └── public/                        # Asset statici
└── example.csv                        # Template CSV di esempio
```

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

---

**Sviluppato durante il tirocinio universitario presso Planetel S.p.A.**
