import axios from "axios";

const API_URL = process.env.API_URL;

export async function getBooksByCategory(categoria) {
  try {
    const response = await axios.get(
      `${API_URL}/subjects/${categoria}.json?limit=10`
    );
     const libri = response.data.works.map((book) => ({
      id: book.key,
      titolo: book.title,
      autore: book.author,
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

