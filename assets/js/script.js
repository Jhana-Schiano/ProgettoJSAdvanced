// TODO: Nel contenitore dei risultati mostrare una icona / immagine (magari con una libreria vuota) al caricamento della pagina e
// se la ricerca non dà risultati mostrare anche un messaggio

import * as api from "./api.js";

let form = document.forms.formCategoria;
let input = form.elements.cercaCategoria;
let risultatiContainer = document.querySelector("#risultatiRicerca");
let caricaAltri = document.createElement("button");
let offset = 0;
let limit = 10;
let categoria = "";
let totaleLibri = 0;

caricaAltri.textContent = "Carica altri";
caricaAltri.className = "caricaAltriBtn";
document.body.append(caricaAltri);
caricaAltri.style.display = "none";

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
  
  if (offset < totaleLibri) {
    caricaAltri.style.display = "block";
  } else {
    caricaAltri.style.display = "none";
  }
});

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
