# Unicum Auto — sito vetrina

Sito statico (HTML, CSS, JavaScript senza dipendenze) per la vendita di auto usate.

## Struttura

```
index.html              pagina unica
assets/css/style.css    stile (tema chiaro e scuro automatico)
assets/js/main.js       parco auto, filtri, galleria, calcolatore rata, form
assets/img/cars/<auto>/ foto ottimizzate per il web (NN.jpg e miniature NN-sm.jpg)
```

## Aggiornare le auto

Tutte le auto sono nell'array `CARS` in cima a `assets/js/main.js`.
Per ogni auto puoi indicare anno, chilometri, alimentazione, cambio e prezzo;
i campi lasciati a `null` non vengono mostrati e `price: null` mostra "Prezzo su richiesta".

Per aggiungere un'auto: crea la cartella `assets/img/cars/<nome-auto>/` con le foto
`01.jpg, 02.jpg, …` (lato lungo ~1200 px) e le miniature `01-sm.jpg, 02-sm.jpg, …` (~600 px),
poi aggiungi una voce in `CARS` con lo stesso `slug` e il numero di foto.

## Da completare prima della pubblicazione

- Indirizzo, telefono, email, orari e partita IVA (sezione Contatti e footer di `index.html`).
- Dati mancanti delle auto (anno, km, prezzo) in `assets/js/main.js`.
- Collegare il modulo contatti a un servizio di invio (Formspree, Netlify Forms o un backend):
  il punto è segnato con un commento in `main.js`.
- Valutare di oscurare le targhe nelle foto.

## Vedere il sito in locale

Apri `index.html` nel browser, oppure:

```
python3 -m http.server 8000
```
