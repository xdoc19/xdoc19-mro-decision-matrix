# MRO Decision Matrix

Aplicație de management achiziții MRO cu matrice de decizie multi-criterii și suport AI.

## Funcționalități

- **5 etape** de proces: Colectare date → RFQ → Analiză oferte → Business Case → Decizie
- Navigare liberă între etape (poți reveni oricând)
- Matrice de decizie cu scoruri ponderate editabile
- Verificare legală, financiară și tehnică a furnizorilor
- Business Case automat (obligatoriu peste 15.000 EUR)
- Sugestii AI de furnizori per categorie MRO
- Dark mode suportat
- Date salvate local în browser (localStorage)

## Stack

- React 18 + Vite 5
- Zero dependențe UI externe (CSS variables custom)

---

## Rulare locală

```bash
npm install
npm run dev
```

Deschide [http://localhost:5173](http://localhost:5173)

---

## Deploy pe Vercel

### Prima dată (GitHub → Vercel)

**1. Creează repo GitHub**

```bash
cd mro-decision-matrix
git init
git add .
git commit -m "feat: initial MRO Decision Matrix"
git branch -M main
git remote add origin https://github.com/TU/mro-decision-matrix.git
git push -u origin main
```

**2. Conectează Vercel**

1. Du-te la [vercel.com](https://vercel.com) → **Add New Project**
2. Selectează repo-ul `mro-decision-matrix` din GitHub
3. Vercel detectează automat Vite — nu schimba nimic
4. Click **Deploy**

**3. Gata!** URL-ul Vercel apare instant.

### Update după modificări

```bash
git add .
git commit -m "feat: descriere modificare"
git push
```
Vercel redeploy-ează automat la fiecare push pe `main`.

---

## Structură proiect

```
src/
  components/
    UI.jsx              # Primitive reutilizabile (Panel, Btn, Badge...)
    ProgressBar.jsx     # Wizard progress cu navigare
    ProjectList.jsx     # Lista proiecte + creare proiect nou
    StepCollect.jsx     # Etapa 1: Colectare date + checklist
    StepRFQ.jsx         # Etapa 2: Template RFQ + furnizori
    StepAnalysis.jsx    # Etapa 3: Oferte + Matrice + Legal + Finance + Tech
    StepBusinessCase.jsx # Etapa 4: Business Case cu ROI automat
    StepDecision.jsx    # Etapa 5: Decizie finală + aprobare
  data/
    constants.js        # Date statice, categorii, criterii, furnizori AI
  App.jsx               # State management + routing
  main.jsx              # Entry point
  index.css             # Design tokens + reset
```
