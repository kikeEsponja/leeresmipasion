class BookCarousel {
    constructor(elementId, visibleBooksCount) {
      this.carouselElement = document.getElementById(elementId);
      this.currentIndex = 0;
      this.visibleBooks = visibleBooksCount;
      this.books = [];
    }
  
    fetchBooks() {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';
        
      fetch('https://leeresmipasion.com:3001/api/books')
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
          this.books = data;
          console.log(data);
          this.updateCarousel();
        })
        .catch(error => {
          console.error('Error fetching books:', error);
        });
    }
  
    updateCarousel() {
        this.carouselElement.innerHTML = ''; // Limpia las imágenes actuales
      
        for (let i = this.currentIndex; i < this.currentIndex + this.visibleBooks; i++) {
            const book = this.books[i % this.books.length];
            const link = document.createElement('a');
            link.style.cursor = 'pointer';
            
            // Configura el evento de clic para almacenar los detalles del libro y redirigir
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Previene la acción por defecto del enlace
                localStorage.setItem('bookDetails', JSON.stringify(book)); // Almacena los detalles del libro en localStorage
                window.location.href = `../public/itemDetailen.html?id=${book.id}`; // Redirige a la página de detalles
            });
    
            const img = document.createElement('img');
            img.src = book.cover;
            //img.alt = `Portada del libro: ${book.title}`; // Atributo alt para accesibilidad
            img.style.borderRadius = '5px';
    
            link.appendChild(img);
            this.carouselElement.appendChild(link);
        }
    }
    
    moveSlide(direction) {
      this.currentIndex = (this.currentIndex + direction + this.books.length) % this.books.length;
      this.updateCarousel();
    }
  }
  
  // Inicialización de los carruseles
  const carouselRepisa1 = new BookCarousel('carouselImagesRepisa1', 6);
  const carouselRepisa2 = new BookCarousel('carouselImagesRepisa2', 6);
  const carouselRepisa3 = new BookCarousel('carouselImagesRepisa3', 6);
  
  document.addEventListener('DOMContentLoaded', () => {
    carouselRepisa1.fetchBooks();
    carouselRepisa2.fetchBooks();
    carouselRepisa3.fetchBooks();
  });
  
  // Agrega listeners para los botones prev y next de cada estantería
  document.getElementById('prevRepisa1').addEventListener('click', () => carouselRepisa1.moveSlide(-1));
  document.getElementById('nextRepisa1').addEventListener('click', () => carouselRepisa1.moveSlide(1));
  
  document.getElementById('prevRepisa2').addEventListener('click', () => carouselRepisa2.moveSlide(-1));
  document.getElementById('nextRepisa2').addEventListener('click', () => carouselRepisa2.moveSlide(1));
  
  document.getElementById('prevRepisa3').addEventListener('click', () => carouselRepisa3.moveSlide(-1));
  document.getElementById('nextRepisa3').addEventListener('click', () => carouselRepisa3.moveSlide(1));
  
  function searchBooks() {
  const query = document.getElementById('searchInput').value;
  const url = `https://leeresmipasion.com:3002/api/search?query=${(query)}`; // Asegúrate de usar la URL correcta y el puerto donde se ejecuta tu servidor Express

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(books => {

        console.log(books);
          const booksContainer = document.getElementById('booksContainer');
          booksContainer.innerHTML = ''; // Limpia el contenedor antes de mostrar los nuevos resultados
          const bookTabla = document.createElement('img');

          if(books.length === 0){
            const mensajeError = document.createElement('div');
            mensajeError.textContent = 'El libro buscado no está acá';
            mensajeError.setAttribute('class', 'no-libro');

            booksContainer.appendChild(mensajeError);
          }else{
            books.forEach(book => {
              const bookElement = document.createElement('div');

              bookElement.setAttribute('class', 'resultado-busqueda');
              bookElement.className = 'resultado-busqueda';
              bookElement.innerHTML = `
                  <img src="${book.cover}">
              `;
              /*<h3>${book.title}</h3>
              <p>Autor: ${book.author}</p>
              <p>Asunto: ${book.subject}</p>*/
              // Agrega más detalles del libro según tu modelo Book
              booksContainer.appendChild(bookElement);
              //booksContainer.appendChild(bookTabla);
          });
        }
      })
      .catch(error => {
          console.error('Error al buscar libros:', error);
          // Maneja el error en la interfaz de usuario según sea necesario
      });
}
  