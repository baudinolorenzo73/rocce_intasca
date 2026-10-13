# Rocce in tasca — v1.0.0

App didattica in italiano per osservare e riconoscere rocce attraverso una chiave interattiva. Il risultato è un'ipotesi da verificare, non un'identificazione automatica o certa.

- Percorso guidato con indietro, ripresa locale e opzione "Non so / nessuna corrisponde".
- Atlante ricercabile: 31 voci, comprese varietà e denominazioni tradizionali.
- Taccuino locale: foto ridotte, luogo, data, note e percorso osservativo.
- Modifica/eliminazione osservazioni, backup JSON con foto e importazione.
- Tema chiaro/scuro, manifest PWA, cache offline e controllo versione.
- Nessuna chiave API, dipendenza di rete per le schede o analisi automatica delle foto.

## Uso

Apri `dist/Rocce_in_tasca_v1.0.html` in un browser: chiave e atlante sono incorporati e funzionano senza rete. Alcuni browser mobili non eseguono HTML locali: in quel caso usa la versione online o servi la cartella `dist`.

Per la PWA, pubblica **il contenuto di `dist`** su hosting HTTPS (es. GitHub Pages). Visita l'app online, poi usa “Installa / scarica” oppure il menu del browser. La copia offline è pronta quando l'app lo segnala. L'installabilità e la disponibilità dei dati locali dipendono dal browser e dall'ambiente di hosting. La pubblicazione Sites iniziale è privata e richiede accesso del proprietario.

Il taccuino appartiene al browser e all'origine dell'app: non si sincronizza tra dispositivi o tra HTML locale e sito. Esporta/importa JSON per trasferirlo. La cancellazione dei dati del browser può eliminare le osservazioni.

## Fonti e adattamento

Ambito iniziale di 31 voci: https://www.gmpe.it/chiavi-riconoscimento-rocce

Quadro generale: https://www.bgs.ac.uk/discovering-geology/rocks-and-minerals/

Composizione e tessitura delle rocce magmatiche: https://www.nps.gov/subjects/geology/igneous.htm

Il percorso è riorganizzato, i testi sono originali e i disegni schematici sono realizzati per l'app. Le fotografie e i testi integrali del sito GMPE non sono riprodotti. Non si tratta di un'app ufficiale del GMPE. I disegni raffigurano famiglie e non sono fotografie diagnostiche.

## Sviluppo

Sito statico, senza build JavaScript o servizi esterni. Per rigenerare l'HTML dalle sorgenti serve Python con Pillow:

```
python3 build.py
node check.mjs
node interaction-check.mjs
```

`template.html`, `style.css`, `app.mjs` e `dist/data.mjs` contengono interfaccia e dati. L'HTML finale incorpora dati, CSS e JavaScript. Il service worker è `dist/sw.js`.

Per una nuova versione aggiorna VERSION in data.mjs, version.json e il nome della cache in sw.js, quindi rigenera. Aggiorna anche il nome dell'HTML scaricabile nei riferimenti se lo cambi.

## Verifica di questa versione

Controllati numero e unicità delle schede, destinazioni della chiave, assenza di cicli, raggiungibilità di tutte le voci (60 percorsi), validazione dei percorsi, sintassi dell'HTML autonomo e presenza delle risorse PWA. Con un DOM minimo simulato sono state verificate anche ricerca, percorso fino a breccia, indietro, alternative, salvataggio indeterminato con percorso, modifica, tema, validazione dei backup ed eliminazione con conferma. La prova visiva su browser e l'installazione su dispositivo reale non sono state eseguite in questo ambiente.
