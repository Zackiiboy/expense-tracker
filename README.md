# Expense Tracker

Kleine Expo/React Native app om dagelijkse uitgaves bij te houden. Gebouwd als
portfolio-project: TypeScript, lokale persistente state, geen backend nodig.

## Waarom deze keuzes

- **AsyncStorage in plaats van een backend**: voor een app die alleen lokaal
  hoeft te werken is een externe database overkill. Het laat wel zien dat ik
  nadenk over persistente state en de juiste tool voor de schaal van het
  probleem kies.
- **Bedragen in centen (integers)** opgeslagen in plaats van floats, om
  afrondingsfouten met geld te vermijden — een klassieke valkuil.
- **Eén custom hook (`useExpenses`)** die alle state-logica en persistence
  bundelt, zodat `App.tsx` zich alleen bezighoudt met UI.

## Setup

```bash
npx create-expo-app@latest expense-tracker --template blank-typescript
cd expense-tracker
npx expo install @react-native-async-storage/async-storage
```

Kopieer daarna `App.tsx`, `types.ts`, `hooks/` en `components/` uit dit
project over de gegenereerde bestanden.

```bash
npx expo start
```

Scan de QR-code met Expo Go, of druk `i` / `a` voor de iOS/Android simulator.

## Gebruik

- Tik op de `+` knop rechtsonder om een uitgave toe te voegen.
- Houd een uitgave lang ingedrukt om 'm te verwijderen.
- Het totaal bovenaan telt automatisch alle uitgaves op.

## Mogelijke uitbreidingen

Dingen die ik bewust heb weggelaten om het binnen één dag haalbaar te houden,
maar die logische vervolgstappen zijn:

- Filteren/groeperen per maand of categorie
- Een grafiek van uitgaves per categorie
- Sync met een backend (bijv. een Laravel API) in plaats van AsyncStorage
- Validatie-feedback in de UI in plaats van stil negeren van foutieve invoer
- Dark mode
