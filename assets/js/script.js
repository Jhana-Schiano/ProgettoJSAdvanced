import * as api from "./api.js";

// Seleziona il form e gli elementi necessari
let form = document.forms.formCategoria;
let input = form.elements.cercaCategoria;
let risultatiContainer = document.querySelector("#risultatiRicerca");

// Crea il bottone "Carica altri"
let caricaAltri = document.createElement("button");
caricaAltri.textContent = "Carica altri";
caricaAltri.className = "caricaAltriBtn";
document.body.append(caricaAltri);
caricaAltri.style.display = "none";

// Inizializza le variabili per la paginazione
let offset = 0;
let limit = 10;
let categoria = "";
let totaleLibri = 0;


/**
 * Listener per il submit del form di ricerca dei libri per categoria 
 */
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  categoria = input.value.trim();
  offset = 0;
  const { libri, totale } = await api.getBooksByCategory(
    categoria,
    offset,
    limit
  );

  totaleLibri = totale;

  visualizzaLibri(libri);

  offset += libri.length;

  // Mostra il bottone "Carica altri" solo se ci sono più libri da caricare
  if (offset < totaleLibri) {
    caricaAltri.style.display = "block";
  } else {
    caricaAltri.style.display = "none";
  }
});


/**
 * Listener per il click su un libro o sul bottone dettagli.
 * Mostra una modale con i dettagli del libro selezionato.
 */
risultatiContainer.addEventListener("click", async function (event) {
  if (
    event.target.classList.contains("dettagliButton") ||
    event.target.classList.contains("titoloLibro")
  ) {
    const bookId = event.target.getAttribute("data-id");
    const dettagli = await api.getBookDetails(bookId);

    // Crea la modale di dettaglio del libro
    let dettaglio = document.createElement("div");
    dettaglio.classList.add("dettaglio-libro");
    dettaglio.innerHTML = `
      <div class="dettaglio-content">
        <span class="close-dettaglio">&times;</span>
        <h2>${dettagli.titolo}</h2>
        <p><strong>Autori:</strong> ${dettagli.autori}</p>
        <p><strong>Descrizione:</strong> <br>${
          dettagli.descrizione
            ? typeof dettagli.descrizione === "string"
              ? dettagli.descrizione
              : dettagli.descrizione.value
            : "Nessuna descrizione disponibile."
        }</p>
      </div>
    `;
    document.body.appendChild(dettaglio);

    // Chiudi il dettaglio al click sulla X o fuori dalla modale
    dettaglio.querySelector(".close-dettaglio").onclick = () =>
      dettaglio.remove();
    dettaglio.onclick = (e) => {
      if (e.target === dettaglio) dettaglio.remove();
    };
  }
});


/**
 *  Listener per il click sul bottone "Carica altri"
 *  Carica altri 10 libri e li aggiunge alla lista
 */
caricaAltri.addEventListener("click", async function () {
  const { libri: nuoviLibri } = await api.getBooksByCategory(
    categoria,
    offset,
    limit
  );
  visualizzaLibri(nuoviLibri, true);
  offset += nuoviLibri.length;
  if (offset >= totaleLibri) caricaAltri.style.display = "none";
});


/**
 * Mostra i libri nel contenitore dei risultati.
 * @param {Array} libri - Array di libri da mostrare
 * @param {boolean} append - Se true, aggiunge i libri a quelli già presenti; se false, li sostituisce
 */
function visualizzaLibri(libri, append = false) {
  if (!append) risultatiContainer.innerHTML = "";
  libri.forEach((libro) => {
    const libroElement = document.createElement("div");
    libroElement.classList.add("libro");
    libroElement.innerHTML = `
      <h2 class="titoloLibro" data-id="${libro.id}">${libro.titolo}</h2>
      <p>Autore: ${libro.autore}</p>
      <button class="dettagliButton" data-id="${libro.id}">Dettagli</button>
    `;
    risultatiContainer.appendChild(libroElement);
  });
}
