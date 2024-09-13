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
        
      	fetch('https://leeresmipasion.com:1024/api/books')
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
                window.location.href = `../public/itemDetail.html?id=${book.id}`; // Redirige a la página de detalles
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

	setVisibleBooksCount(count){
    	this.visibleBooks = count;
    	this.updateCarousel();
    }
  }
  
  // Inicialización de los carruseles
  const carouselRepisa1 = new BookCarousel('carouselImagesRepisa1', 4);
  const carouselRepisa2 = new BookCarousel('carouselImagesRepisa2', 4);
  const carouselRepisa3 = new BookCarousel('carouselImagesRepisa3', 4);
  
  document.addEventListener('DOMContentLoaded', () => {
    carouselRepisa1.fetchBooks();
    carouselRepisa2.fetchBooks();
    carouselRepisa3.fetchBooks();
  
  	const mediaQuery = window.matchMedia('(max-width: 500px)');
  
  	const handleScreenChange = (e) => {
    	const visibleBooksCount = e.matches ? 1 : 4;
    	carouselRepisa1.setVisibleBooksCount(visibleBooksCount);
    	carouselRepisa2.setVisibleBooksCount(visibleBooksCount);
    	carouselRepisa3.setVisibleBooksCount(visibleBooksCount);
    };
  	handleScreenChange(mediaQuery);
  	mediaQuery.addEventListener('change', handleScreenChange);
  });

  
  // Agrega listeners para los botones prev y next de cada estantería
  document.getElementById('prevRepisa1').addEventListener('click', () => carouselRepisa1.moveSlide(-1));
  document.getElementById('nextRepisa1').addEventListener('click', () => carouselRepisa1.moveSlide(1));
  
  document.getElementById('prevRepisa2').addEventListener('click', () => carouselRepisa2.moveSlide(-1));
  document.getElementById('nextRepisa2').addEventListener('click', () => carouselRepisa2.moveSlide(1));
  
  document.getElementById('prevRepisa3').addEventListener('click', () => carouselRepisa3.moveSlide(-1));
  document.getElementById('nextRepisa3').addEventListener('click', () => carouselRepisa3.moveSlide(1));
  
  //---------------------------------FUNCIÓN BUSCAR-------------------------------------------------------
  function searchBooks() {
    const query = document.getElementById('searchInput').value;
    const inputSearchContainer = document.querySelector('.inputSearchContainer');
    const inputSearch = document.querySelector('.inputSearch');
    
    // Mostrar inputSearchContainer
    inputSearchContainer.style.display = 'flex';

    // Actualizar el contenido de inputSearch
    inputSearch.textContent = query;

    const url = `https://leeresmipasion.com:1025/api/search?query=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(books => {
            const booksContainer = document.getElementById('booksContainer');
            booksContainer.innerHTML = ''; // Limpia el contenedor antes de mostrar los nuevos resultados

            const carouselContainer = document.getElementById('carouselSearchContainer');
            carouselContainer.innerHTML = ''; // Limpia el contenedor del carrusel antes de crear uno nuevo

            if (books.length === 0) {
                const mensajeError = document.createElement('div');
                mensajeError.textContent = 'El libro buscado no está aquí';
                mensajeError.setAttribute('class', 'no-libro');

                booksContainer.appendChild(mensajeError);
            } else {
                // Crea el carrusel para los libros encontrados
                const carouselId = 'carouselSearch'; // ID del carrusel de búsqueda
                const carouselDiv = document.createElement('div');
                carouselDiv.setAttribute('id', carouselId);
                carouselDiv.setAttribute('class', 'carousel');

                const carouselImagesDiv = document.createElement('div');
                carouselImagesDiv.setAttribute('id', 'carouselImagesSearch');
                carouselDiv.appendChild(carouselImagesDiv);

                const prevButton = document.createElement('button');
                prevButton.setAttribute('class', 'bi bi-caret-left');
                prevButton.setAttribute('id', 'prevSearch');
                carouselDiv.appendChild(prevButton);

                const nextButton = document.createElement('button');
                nextButton.setAttribute('class', 'bi bi-caret-right');
                nextButton.setAttribute('id', 'nextSearch');
                carouselDiv.appendChild(nextButton);

                carouselContainer.appendChild(carouselDiv);

                // Inicializa el carrusel con los libros encontrados
                const carouselSearch = new BookCarousel('carouselImagesSearch', 3);
                carouselSearch.books = books; // Establece los libros para el carrusel
                carouselSearch.updateCarousel();

                // Agrega listeners para los botones previo y siguiente
                document.getElementById('prevSearch').addEventListener('click', () => carouselSearch.moveSlide(-1));
                document.getElementById('nextSearch').addEventListener('click', () => carouselSearch.moveSlide(1));
            }

            // Agrega la imagen de la tabla después del carrusel
            const tablaImg = document.createElement('img');
            tablaImg.setAttribute('src', './src/img/tabla.svg');
            tablaImg.setAttribute('class', 'tabla');
            carouselContainer.appendChild(tablaImg);
        })
        .catch(error => {
            console.error('Error al buscar libros:', error);
            // Maneja el error en la interfaz de usuario según sea necesario
        });
}