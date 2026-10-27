# Demo CRM — Rodriguez Impianti

Demo di gestionale clienti per un'azienda che installa e fa manutenzione di climatizzatori e pompe di calore.

- `index.html` — versione autonoma da caricare su qualsiasi hosting statico (es. `andiamonline.eu/rodriguez-crm/`). Un solo file, nessun backend.
- `app.html` — stesso contenuto senza intestazione HTML, usato per l'anteprima Artifact.

Sezioni: Panoramica, Clienti (scheda con impianti e storico), Impianti (BTU, gas, t CO₂ eq, garanzia), Interventi (agenda e carico tecnici), Preventivi (IVA 10%, detrazioni), Scadenze (manutenzioni, F-gas, garanzie).

I dati sono di esempio e si salvano solo nel browser di chi apre la pagina (localStorage). Il pulsante "Ripristina dati demo" li riporta allo stato iniziale.
