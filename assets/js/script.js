// la lista deve essere paginata / dare la possibilità di caricare più file -> lodash (?)

// al click devo chiamare un'altra api per ottenere i dettagli del libro

//buona struttura del progetto

// Nel contenitore dei risultati mostrare una icona / immagine (libreria vuota) al caricamento della pagina e
// se la ricerca non dà risultati mostrare anche un messaggio

console.log("File script.js - import del modulo api.js");

import * as api from "./api.js";

let form = document.forms.formCategoria;
let input = form.elements.cercaCategoria;
let risultatiContainer = document.querySelector("#risultatiRicerca");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const categoria = input.value.trim();
  console.log("Categoria cercata:", categoria);
  const libri = await api.getBooksByCategory(categoria);
  console.log("Libri trovati:", libri);

  // Mostra i risultati nella pagine e pulisci i risultati precedenti
  risultatiContainer.innerHTML = "";
  if (libri.length === 0) {
    risultatiContainer.innerHTML =
      "<p>Nessun libro trovato per questa categoria.</p>";
    return;
  }

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
});

risultatiContainer.addEventListener("click", async function (event) {
  if (
    event.target.classList.contains("dettagliButton") ||
    event.target.classList.contains("titoloLibro")
  ) {
    const bookId = event.target.getAttribute("data-id");
    const dettagli = await api.getBookDetails(bookId);
    console.log("Dettagli del libro:", dettagli);
    // Crea la modale
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
