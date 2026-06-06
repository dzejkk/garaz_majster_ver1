$$

garaz-majster/                  # Hlavný koreňový priečinok (Monorepo)
├── backend/                    # --- BACKEND (Node.js + Express + TS) ---
│   ├── drizzle/                # Vygenerované SQL migrácie z Drizzle Kit
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts        # Inicializácia pripojenia k PostgreSQL (Drizzle)
│   │   │   └── schema.ts       # Definícia DB tabuliek a vzťahov
│   │   ├── controllers/        # Logika pre spracovanie požiadaviek (Request/Response)
│   │   │   └── vehicle.controller.ts
│   │   ├── routes/             # Definícia API ciest (Endpoints)
│   │   │   └── vehicle.routes.ts
│   │   ├── middleware/         # Overovanie tokenov (Clerk auth), validácie
│   │   │   └── auth.middleware.ts
│   │   └── index.ts            # Vstupný bod aplikácie (Express setup)
│   ├── .env                    # Lokálne premenné prostredia (DATABASE_URL, PORT)
│   ├── .gitignore              # Ignorovanie node_modules a .env
│   ├── drizzle.config.ts       # Konfigurácia pre Drizzle Kit CLI
│   ├── package.json            # Závislosti backendu
│   └── tsconfig.json           # Nastavenia TypeScript kompilátora
│
└── frontend/                   # --- FRONTEND (Vite + React + TSX) ---
    # (Sem sa dostaneme neskôr, štruktúru pre TanStack Router vygenerujeme tu)
$$
