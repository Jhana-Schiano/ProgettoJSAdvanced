import axios from "axios";

// URL base delle API, letto da variabile d'ambiente
const API_URL = process.env.API_URL;

/**
 * Recupera una lista di libri per una determinata categoria.
 * @param {string} categoria - La categoria dei libri da cercare (es: "fantasy")
 * @param {number} offset - Da quale posizione iniziare a recuperare i libri
 * @param {number} limit - Quanti libri recuperare per ogni chiamata
 * @returns {Promise<{libri: Array, totale: number}>} Un oggetto con la lista dei libri e il numero totale
 */
export async function getBooksByCategory(categoria, offset = 0, limit = 10) {
  try {
    const response = await axios.get(
      `${API_URL}/subjects/${categoria}.json?fields=*,availability&limit=${limit}&offset=${offset}`
    );

    // Mappa i dati ricevuti per estrarre solo le informazioni utili
    const libri = response.data.works.map((book) => ({
      id: book.key,
      titolo: book.title,
      autore:
        book.authors && book.authors.length > 0
          ? book.authors.map((a) => a.name).join(", ")
          : "Sconosciuto",
    }));

    // Ritorna anche il numero totale di libri trovati
    return { libri, totale: response.data.work_count };
  } catch (error) {
    console.error("Errore durante la chiamata API:", error);
    return { libri: [], totale: 0 };
  }
}


/**
 * Recupera i dettagli di un libro dato il suo ID.
 * @param {string} bookId - L'ID del libro (es: "/works/OL12345W")
 * @returns {Promise<Object|null>} Un oggetto con i dettagli del libro, oppure null in caso di errore
 */
export async function getBookDetails(bookId) {
  try {
    const response = await axios.get(`${API_URL}${bookId}.json`);
    const bookDetails = {
      id: response.data.key,
      titolo: response.data.title,
      descrizione: response.data.description,
      autori:
        response.data.authors && response.data.authors.length > 0
          ? await Promise.all(
              response.data.authors.map(async (a) => {
                if (a.author && a.author.key) {
                  // Recupera il nome dell'autore tramite il suo id con una chiamata API
                  try {
                    const authorRes = await axios.get(
                      `${API_URL}${a.author.key}.json`
                    );
                    return authorRes.data.name;
                  } catch {
                    return "Sconosciuto";
                  }
                }
                return "Sconosciuto";
              })
            ).then((nomi) => nomi.join(", "))
          : "Sconosciuto",
    };
    return bookDetails;
  } catch (error) {
    console.error("Errore durante la chiamata API:", error);
    return null;
  }
}
