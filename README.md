# ScopeLedger — Boutique Agency Margin-Protection Kit

> An operational decision tool and margin-protection kit designed for owners and delivery leads of boutique web design agencies (specifically studios delivering $5,000–$25,000 fixed-fee websites on platforms like Webflow and Framer).

Fixed-fee web design studios routinely bleed **15% to 25%** of their project profit due to unpriced scope creep (unplanned CMS collections, third-party integrations, design reversals, and extra revision rounds). **ScopeLedger** solves this by turning scope disputes into a standardized, 2-minute workflow: connecting client requests to the baseline agreement, isolating internal delivery costs from client-facing quotes, calculating real-time margin adjustments, and generating a client-ready "Scope Change Brief" PDF.

---

## 1. The TRACE Decision Framework

ScopeLedger structures every incoming scope request through the **5-step TRACE methodology**:

1. **T — Trace the Agreement:**
   - Locks the agreed baseline project fee ($F$), incurred sunk costs ($A$), and remaining forecast cost to finish ($R$).
   - Calculates total committed cost ($C = A + R$) and monitors baseline margin health via an interactive circular/arc SVG gauge.
2. **R — Route the Obligation:**
   - Categorizes incoming requests into four distinct obligation branches:
     - **Included Work:** Already covered in contract scope ($0 fee to client; internal delivery update).
     - **Defect / Rework:** Agency execution flaw or bug (Resolve internally under studio QA warranty; no client charge).
     - **Ambiguous Scope:** Contract boundary unclear (Halts automatic quoting; prompts clarification discovery email template).
     - **Addition:** True out-of-scope addition (Unlocks commercial estimation and pricing matrix).
3. **A — Assess the Total Effect:**
   - **Private Delivery Vault:** UI/UX design hours, Webflow/dev hours, PM/QA hours with loaded labor rates ($/hr), outside direct vendor costs (plugins/APIs), and avoidable deducted scope.
   - Calculates Net Incremental Delivery Cost ($D$).
   - Quantifies schedule and timeline impact in working days.
4. **C — Choose an Offer (Interactive Commercial Matrix):**
   - 4 interactive option cards with real-time margin visual feedback:
     - **Quote:** Charge the client using the Price Floor, Whole-Project Restorative Fee, or custom fee slider ($P$).
     - **Absorb:** Perform work at $0 additional charge; dynamically displays margin erosion and studio profit loss ($-D$).
     - **Exchange:** Swap out existing unfinished scope of equal value ($D$ offset to $0$, timeline preserved).
     - **Defer:** Postpone request to Phase 2 backlog or politely decline with auto-generated client email.
5. **E — Evidence the Decision (Client-Ready Deliverable):**
   - Generates a clean, formal "Scope Change Brief" and "Change Invoice / Agreement".
   - Includes document reference, project/client name, agency branding, plain-English change description, agreed fee, delivery conditions, and digital signature line.
   - **Zero-Leak Guarantee:** Client exports strictly exclude internal hours, loaded labor rates, and studio margin percentages. Includes a toggle to audit "Client Deliverable View" vs "Studio Audit View".

---

## 2. Core Mathematical Engine

All calculations are mathematically exact, reactive, and protected against division by zero and negative values:

- **Variables:**
  - $F$: Current approved project fee.
  - $A$: Actual labor and delivery costs incurred to date.
  - $R$: Estimated remaining committed delivery costs to finish agreed baseline.
  - $C$: Total committed delivery cost:
    $$C = A + R$$
  - $D$: Incremental net delivery cost of the requested change:
    $$D = \sum(\text{Hours} \times \text{Loaded Hourly Rate}) + \text{Outside Vendor Costs} - \text{Avoidable Removable Costs}$$
    *(Note: Sunk costs $A$ are never subtracted from $D$ to protect project profit).*
  - $g$: Target contribution margin expressed as a decimal ($0 \le g < 1$, e.g., $0.38$ for 38%).
  - $P$: Proposed or selected change fee quoted to the client.

- **Formulas:**
  - **Current Baseline Margin:**
    $$\text{Margin}_{\text{current}} = \frac{F - C}{F}$$
  - **Margin if Absorbed (Internal Loss):**
    $$\text{Margin}_{\text{absorbed}} = \frac{F - C - D}{F}$$
  - **Incremental Change Price Floor** (covers the change at target margin $g$):
    $$\text{Price Floor} = \frac{D}{1 - g} \quad (\text{for } D \ge 0)$$
  - **Whole-Project Restorative Fee** (restores the entire project to margin $g$ if already underpriced):
    $$\text{Restorative Fee} = \max\left(0, \frac{C + D}{1 - g} - F\right)$$
  - **Resulting Margin at Quoted Fee $P$:**
    $$\text{Margin}_{\text{new}} = \frac{F + P - C - D}{F + P}$$

---

## 3. Agency Playbook (12 Pre-Built Common Scenarios)

ScopeLedger includes 12 pre-calibrated agency scenario templates that auto-populate descriptions, route, hours, outside costs, and client conditions with one click:

1. **Add CMS collection mid-build** (+12h, Addition, suggested price floor)
2. **Late client asset delivery delay** (+8h, timeline dependency, +14d extension)
3. **Client reverses previously approved design** (+16h, Addition, redesign sprint)
4. **Extra revision round beyond allowance** (+8h, Addition, consolidated feedback)
5. **Third-party API / Webhook integration** (+14h, outside API proxy cost)
6. **New landing page after sitemap sign-off** (+20h, full responsive lifecycle)
7. **Broken responsive layout (defect triage)** (Defect / Rework, $0 client charge, QA warranty)
8. **Unplanned multi-language / localization setup** (+18h, Weglot subscription)
9. **Urgent out-of-scope Friday deployment** (+7h, emergency rush surcharge)
10. **"Quick favor" scope drift accumulation** (+10h, batched enhancement package)
11. **Mid-build scope swap request** (Exchange, dollar-for-dollar scope trade, $0 net fee)
12. **Verbal request needing written documentation** (Ambiguous Scope, clarification checklist)

---

## 4. Architecture & Key Features

- **Zero-Backend Architecture:** Runs entirely in client browser `localStorage`. No mandatory accounts, external databases, or third-party servers.
- **Data Portability:** "Workspace Settings" modal includes clean JSON **Export Workspace Backup** and **Import Workspace Backup** to prevent data loss.
- **Commercial Licensing Layer (Gumroad Ready):**
  - **Free Demo Mode:** Preloaded with complete sample project ("Harbor / Brand & Experience Website").
  - **Paywall Triggers:** Triggers license modal when creating >1 custom project or exporting unwatermarked PDFs.
  - **Watermark:** Demo briefs are watermarked with `SCOPELEDGER DEMO`.
  - **Tiers:** Individual Plan ($49.79 once, 2 device activations) & Agency Plan ($69.79 once, 5 device activations).
  - **Verification:** License key validator with simulation buttons and "Release This Device" management.
- **Keyboard Shortcuts:** `Cmd+K` for Playbook, `1`–`5` or `T`/`R`/`A`/`C`/`E` for TRACE navigation, `?` for guide, `Esc` to close modals.
- **Print to PDF:** Dedicated `@media print` CSS cleanly isolates and formats the Scope Change Brief for print or PDF download.

---

## 5. Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```
