 "Garáž Majster"

## 🛠️ Technický Stack

- Frontend: React.js, Vite, TS, VSCode
- Knižnice: TanStack Query, TanStack Router, Framer Motion
- Štýlovanie: CSS Modules (Striktne nepoužívame Tailwind, iba .module.css súbory!)
- Backend: Node.js, Drizzle ORM, PostgreSQL

## 📁 Smerovanie (Routing) & Štruktúra

Používame plochú (dot-separated) štruktúru súborov v TanStack Routeri v `src/routes/`. Trasy sú nastavené ako nezávislí súrodenci, takže globálny Sidebar a Header zostávajú na mieste a mení sa len stredový obsah:

1. `vehicles.$vehicleId.index.tsx` (Cesta: `/vehicles/$vehicleId/`) -> Komponent `VehicleDetail` (Zobrazuje štatistiky, widgety a intervaly).
2. `vehicles.$vehicleId.service-logs.tsx` (Cesta: `/vehicles/$vehicleId/service-logs`) -> Komponent `VehicleServisLogs` (Zobrazuje zoznam servisnej histórie).

## 🔄 Logika intervalov (Kilometre + Čas)

Implementovali sme pravidlo „Čo nastane skôr“ (Whichever comes first).

- V tabuľke `serviceTasks` sledujeme stĺpce: `intervalKm`, `intervalMonths`, `lastPerformedOdometer`, `lastPerformedDate`.
- Backend (`vehicleStatusModel`) prepočítava zostávajúce kilometre (`remainingKm`) aj zostávajúce dni (`remainingDays`).
- Výsledný stĺpec `status` ("DUE" / "WARNING" / "OK") kombinuje obe hrozby (ak vypršia dni, ale kilometre sú ešte v norme, status je aj tak nekompromisne "DUE").

## 💡 UX stratégia pre úlohy/intervaly (Hybridné riešenie)

1. Automatický štart: Pri vytvorení nového auta (POST `/api/vehicles`) backend automaticky vygeneruje základné šablóny úloh (napr. Výmena oleja: 15 000 km / 12 mesiacov) do `serviceTasks`, aby používateľ hneď videl progress bary.
2. Vlastné úpravy: V detaile auta bude možnosť upraviť tieto predvolené hodnoty alebo pridať vlastnú špecifickú úlohu (napr. Rozvody) cez vyskakovací Modal.
3. Prepojenie s históriou: Pri zápise nového servisu si používateľ v dropdown menu voliteľne vyberie, na ktorú úlohu (napr. Výmena oleja) sa tento log viaže. Ak ju vyberie, backend v jednej transakcii zapíše log a zároveň prepíše `lastPerformedOdometer` a `lastPerformedDate` v danej úlohe, čím vyresetuje interval.


## 🏗️ Architektonické rozhodnutia a Návrhové vzory

### 1. Zdieľaný formulár pre Create / Edit (Form Reusability)
Namiesto duplikovania kódu používame jeden univerzálny komponent `<VehicleForm />`.
- Rodičovský komponent (stránka alebo Drawer) zodpovedá za sietovú logiku a podhadzuje 
- formuláru mutáciu (`useCreateVehicle` alebo `useUpdateVehicle`) cez prop `onSubmit`.
- Formulár funguje ako nezávislá jednotka: spracováva validácie a stav inputov,
- po odoslaní vracia čistý `payload` rodičovi.

### 2. BFF (Backend-For-Frontend) & Dashboard Aggregate Pattern
Na stránkach detailu (napr. `VehicleDetailPage`) nevoláme z frontendu viacero 
samostatných endpointov pre auto, štatistiky a servisné intervaly.
- Využívame agregovaný endpoint `/api/vehicles/:id/status`, ktorý na strane servera
- spojí SQL dopyty a vráti kompletný balík dát pre danú obrazovku.
- **Pravidlo úplnosti dát:** Vlastnosť `vehicleInfo` v tomto balíku musí vždy obsahovať 
- 100% entitu z databázy (`SELECT *`). Garantuje to bezpečné predvyplnenie editačného 
- formulára (`initialData`) bez rizika straty dát pri následnom `PATCH` update.