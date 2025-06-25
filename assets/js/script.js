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
        risultatiContainer.innerHTML = "<p>Nessun libro trovato per questa categoria.</p>";
        return;
    }

    libri.forEach(libro => {
        const libroElement = document.createElement("div");
        libroElement.classList.add("libro");
        libroElement.innerHTML = `
            <h2>${libro.titolo}</h2>
            <p>Autore: ${libro.autore}</p>
            <button class="dettagliButton" data-id="${libro.id}">Dettagli</button>
        `;
        risultatiContainer.appendChild(libroElement);
    });
});


risultatiContainer.addEventListener("click", async function (event) {
  if (event.target.classList.contains("dettagliButton")) {
    const bookId = event.target.getAttribute("data-id");
    const dettagli = await api.getBookDetails(bookId);
    console.log("Dettagli del libro:", dettagli);
  }
});