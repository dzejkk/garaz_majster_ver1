Ahoj, pokračujeme vo vývoji projektu "Garáž Majster". Použi tento kompletný kontext, aby si presne vedel, v akom stave je kód, architektúra a čo ideme robiť teraz:

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

## 🎯 Čo ideme robiť teraz

- implementovat zapis kilometrov pre vozdilo
- ptm musime upravit serviceInterval Badge aby nam pekne zobrazovalo prepasnute dni aj kilometre,
- spravit z par veci komponenty aby sa to trosku upratalo
- atd....
