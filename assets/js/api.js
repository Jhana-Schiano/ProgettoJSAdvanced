import axios from "axios";

const API_URL = process.env.API_URL;

async function getBooksByCategory(category) {
  try {
    const response = await axios.get(
      `${API_URL}/subjects/${category}.json?limit=10`
    );
     const books = response.data.works.map((book) => ({
      id: book.key,
      title: book.title,
    }));
    return books;
  } catch (error) {
    console.error("Errore durante la chiamata API:", error);
    return [];
  }
}


async function getBookDetails(bookId) {
  try {
    const response = await axios.get(`${API_URL}${bookId}.json`);
    const bookDetails = {
      id: response.data.key,
      title: response.data.title,
      description: response.data.description,
    };
    return bookDetails;
  } catch (error) {
    console.error("Errore durante la chiamata API:", error);
    return null;
  }
}


let bookExampleId = "";
// Esempio di utilizzo:
await getBooksByCategory("fantasy").then((books) => {
  console.log("Libri trovati:", books);
  bookExampleId = books[0]?.id || "";
  console.log("ID del primo libro:", bookExampleId);
});


await getBookDetails(bookExampleId).then((details) => {
  console.log("Dettagli del libro:", details);
});

