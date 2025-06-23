//chiamare l'api esterna per ottenre una lista di libri in base alla categoria -> servizio axios o lodash (?)

//dovrò salvarle su una variabile d'ambiente

// deve essere paginato / dare la possibilità di caricare più file

// al click devo chiamare un'alttra api per ottenere i dettagli del libro

//buona struttura del progetto

//webpack

console.log("File script.js - import del modulo api.js");

import * as api from "./api.js";

let form = document.forms.formCategoria;


form.addEventListener("submit", async function (event) {
    const categoria = event.target.value;
    console.log("Categoria cercata:", categoria);
    // Chiamata all'API per cercare i libri per categoria
    const libri = await api.getBooksByCategory(categoria);
    console.log("Libri trovati:", libri);

    // Mostra i risultati nella pagina
    const risultatiContainer = document.getElementById("risultatiRicerca");

    // Pulisci i risultati precedenti
    risultatiContainer.innerHTML = ""; 
    if (libri.length === 0) {
        risultatiContainer.innerHTML = "<p>Nessun libro trovato per questa categoria.</p>";
        //aggiunti icona o immagine di errore
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


function creaCardLibro(id, titolo, autore) {
    const card = document.createElement("div");
    card.classList.add("libro-card");
    card.innerHTML = `
        <h3>${titolo}</h3>
        <p>Autore: ${autore}</p>
    `;
    return card;
}
