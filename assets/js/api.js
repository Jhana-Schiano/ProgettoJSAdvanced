import axios from "axios";

console.log("Esempio di implementazione di una chiamata API con Axios - primi 10 libri della categoria 'fantasy'");

async function getBooksByCategory(category) {
  try {
    const response = await axios.get(
      `https://openlibrary.org/subjects/${category}.json?limit=10`
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

// Esempio di utilizzo:
getBooksByCategory("fantasy").then((books) => {
    console.log("Libri trovati:", books);
  });
  
