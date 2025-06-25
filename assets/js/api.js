import axios from "axios";

const API_URL = process.env.API_URL;

export async function getBooksByCategory(categoria) {
  try {
    const response = await axios.get(
      `${API_URL}/subjects/${categoria}.json?fields=*,availability&limit=10`
    );
    const libri = response.data.works.map((book) => ({
      id: book.key,
      titolo: book.title,
      autore:
        book.authors && book.authors.length > 0
          ? book.authors.map((a) => a.name).join(", ")
          : "Sconosciuto",
    }));
    return libri;
  } catch (error) {
    console.error("Errore durante la chiamata API:", error);
    return [];
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
                // Se l'autore è un oggetto con un campo 'author', prendi il nome
                if (a.author && a.author.key) {
                  // Recupera il nome dell'autore tramite ulteriore chiamata API
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

// let bookExampleId = "";
// // Esempio di utilizzo:
// await getBooksByCategory("fantasy").then((libri) => {
//   console.log("Libri trovati:", libri);
//   bookExampleId = libri[0]?.id || "";
//   console.log("ID del primo libro:", bookExampleId);
// });

// await getBookDetails(bookExampleId).then((details) => {
//   console.log("Dettagli del libro:", details);
// });
