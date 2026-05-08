# KONSPEKT: MODUŁ HYBRYDOWY L3⊕L5 — "INSTANCE-DESCRIPTOR FUSION CORE"

## 1. CO TO JEST L3 i L5 (przypomnienie)

**L3 — INSTANCES (Instancje modułów FUKO)**
- Konkretne, działające egzemplarze 11 modułów FUKO (PROB, RAM, ID, AUDITOR, MULTI, SYNC, OSINT, LICENSE, FAILSAFE, META_DECISION).
- Każda instancja ma stan, cykl życia, właściciela, kontekst uruchomienia.
- Odpowiada na pytanie: **„Który moduł, w której wersji, dla kogo działa teraz?"**

**L5 — DESCRIPTORS (Deskryptory metadanych i kontekstu)**
- Warstwa opisowa: metadane, tagi semantyczne, kontekst kulturowy, znaczniki intencji, ślady stylu.
- Każdy deskryptor opisuje „dlaczego" i „w jakich warunkach" dana komórka decyzyjna istnieje.
- Odpowiada na pytanie: **„Co znaczy ta decyzja w szerszym kontekście tożsamości?"**

Pomiędzy nimi (L4) leżą Decision Cells — ale nowy moduł je **omija**, łącząc bezpośrednio surową instancję ze znaczeniem.

---

## 2. CO POWSTAJE Z FUZJI L3+L5

Nowy człon: **„Instance-Descriptor Fusion Core" (IDFC)** — warstwa, w której **każda żywa instancja modułu jest natychmiast wzbogacona o pełny kontekst semantyczny**, bez przechodzenia przez warstwę komórek decyzyjnych.

### Wynikowe funkcjonalności (8 głównych)

**F1. Live Instance Tagger**
- Każda nowa instancja FUKO przy uruchomieniu otrzymuje automatycznie zestaw deskryptorów (kontekst właściciela, cel, styl, środowisko).
- Efekt: instancje są „samoopisujące się" — można je filtrować po znaczeniu, nie tylko po typie.

**F2. Semantic Instance Router**
- Routing zadań do instancji nie po typie modułu, lecz po **dopasowaniu deskryptorów** (np. „instancja FUKO_PROB z deskryptorem 'wysokie ryzyko + styl mentor'").
- Eliminuje sztywne mapowanie typ→moduł.

**F3. Context-Aware Lifecycle Manager**
- Cykl życia instancji (uruchom/wstrzymaj/zabij/sklonuj) sterowany deskryptorami.
- Przykład: instancje z deskryptorem „eksperymentalne" mają krótszy TTL i auto-snapshot.

**F4. Descriptor-Driven Cloning**
- Klonowanie instancji wraz z mutacją deskryptorów (np. sklonuj FUKO_RAM, zmień styl z „fighter" na „reflektor").
- Podstawa pod A/B testing stylu na żywych instancjach.

**F5. Instance Provenance Trail**
- Pełna historia: która instancja, w jakim kontekście, z jakimi deskryptorami, co zrobiła.
- Audyt nie po komórkach, lecz po **parze (instancja × deskryptor)** — szybszy i czytelniejszy.

**F6. Style-Bound Instance Pools**
- Pule instancji grupowane po deskryptorach stylu/tożsamości (np. „pool mentora", „pool fightera").
- Każda pula ma własne limity, polityki, priorytety.

**F7. Cross-Instance Semantic Sync**
- Instancje o tych samych deskryptorach automatycznie wymieniają stan (mini-synchronizacja bez angażowania FUKO_SYNC).
- Tani mechanizm spójności w obrębie jednego stylu/kontekstu.

**F8. Descriptor Drift Detector**
- Wykrywa, gdy deskryptory instancji rozjeżdżają się ze stanem rzeczywistym (np. instancja oznaczona „mentor" zaczyna działać agresywnie).
- Trigger dla FUKO_AUDITOR.

---

## 3. ARCHITEKTURA MODUŁU IDFC

```text
                    ┌──────────────────────────────┐
                    │   IDFC — Fusion Core (L3⊕L5) │
                    └──────────────┬───────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   ┌────▼─────┐              ┌─────▼──────┐            ┌──────▼──────┐
   │ Instance │              │ Descriptor │            │  Fusion     │
   │ Registry │◄────────────►│  Catalog   │◄──────────►│  Bindings   │
   │  (L3)    │              │   (L5)     │            │  (L3 × L5)  │
   └────┬─────┘              └─────┬──────┘            └──────┬──────┘
        │                          │                          │
        └──────────┬───────────────┴──────────────┬───────────┘
                   │                              │
            ┌──────▼──────┐                ┌──────▼──────┐
            │  Semantic   │                │  Lifecycle  │
            │   Router    │                │   Manager   │
            └─────────────┘                └─────────────┘
```

### Komponenty
- **Instance Registry** — żywe instancje 11 modułów FUKO (z `centralStateManager` i `AgentRegistry`).
- **Descriptor Catalog** — słownik deskryptorów (styl, intencja, kontekst, ryzyko, właściciel, środowisko).
- **Fusion Bindings** — tabela wiążąca każdą instancję z N deskryptorami (relacja many-to-many) + waga i timestamp.
- **Semantic Router** — wybiera instancję pod zadanie po dopasowaniu deskryptorów.
- **Lifecycle Manager** — egzekwuje polityki cyklu życia wynikające z deskryptorów.

---

## 4. PLAN WDROŻENIA

### Krok 1 — Backend (Lovable Cloud)
Migracja tworząca tabele:
- `idfc_instances` (id, fuko_module, owner_id, status, ttl, started_at)
- `idfc_descriptors` (id, key, value, category: style|intent|context|risk|env)
- `idfc_bindings` (instance_id, descriptor_id, weight, bound_at) — z RLS
- `idfc_provenance` (instance_id, descriptor_snapshot, action, payload, ts)

### Krok 2 — Serwisy
- `src/services/idfc/instanceRegistry.ts` — CRUD instancji + lifecycle.
- `src/services/idfc/descriptorCatalog.ts` — zarządzanie słownikiem deskryptorów.
- `src/services/idfc/fusionBinder.ts` — wiązanie instancji z deskryptorami, mutacje, klonowanie.
- `src/services/idfc/semanticRouter.ts` — routing po deskryptorach.
- `src/services/idfc/driftDetector.ts` — wykrywanie dryfu deskryptorów.

### Krok 3 — Edge function
- `supabase/functions/idfc-router` — server-side routing semantyczny dla zewnętrznych wywołań.

### Krok 4 — UI w Lab Observatory
Nowa zakładka **„IDFC — Fusion Core"** w `LabObservatory.tsx` z 4 sekcjami:
1. Live Instance Map (instancje + ich deskryptory)
2. Descriptor Catalog (przegląd / edycja)
3. Semantic Router Console (test zapytań)
4. Drift Monitor (alerty)

Komponenty:
- `src/components/lab/idfc/InstanceMap.tsx`
- `src/components/lab/idfc/DescriptorCatalog.tsx`
- `src/components/lab/idfc/RouterConsole.tsx`
- `src/components/lab/idfc/DriftMonitor.tsx`
- `src/components/lab/IDFCPanel.tsx` (kontener z tabami)

### Krok 5 — Integracje
- Hook `useFuko` → automatyczna rejestracja instancji w IDFC przy uruchomieniu.
- `centralStateManager` → emisja eventów lifecycle do `idfc_provenance`.
- `FUKO_AUDITOR` → konsument alertów z `driftDetector`.

---

## 5. CO ZYSKUJEMY

- **Bez L4** (komórek decyzyjnych) — szybsze ścieżki dla prostych zadań.
- **Sterowanie systemem przez znaczenie**, nie przez typ techniczny.
- **A/B testy stylu** na żywych instancjach bez restartu rdzenia.
- **Pełna obserwowalność** par (instancja × kontekst) zamiast tylko logów modułów.
- **Fundament pod Worker Economy (Faza 3)** — instancje stają się „pracownikami" o jasnym profilu kompetencji wyrażonym deskryptorami.

---

## 6. POZA ZAKRESEM (świadomie)

- L4 Decision Cells — pomijane z definicji (cel modułu).
- L6+ głęboka logika — IDFC tylko emituje sygnały, nie przetwarza.
- Zmiany w istniejących modułach FUKO — IDFC siedzi obok, integruje się przez eventy.
