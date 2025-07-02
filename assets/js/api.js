import axios from "axios";

const API_URL = process.env.API_URL;

export async function getBooksByCategory(categoria, offset = 0, limit = 10) {
  try {
    const response = await axios.get(
      `${API_URL}/subjects/${categoria}.json?fields=*,availability&limit=${limit}&offset=${offset}`
    );
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
