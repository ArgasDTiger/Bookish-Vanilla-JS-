async function main() {
    await addAuthorsToStore();
    await addGenresToStore();
    await fillStore();
}

main().catch(error =>
    console.error('Error in main function:', error));

const storeProducts = document.getElementById('storeProducts');
async function getAuthors() {
    try {
        const response = await fetch('./books_db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const authors = new Set([]);
        for (let book of data.books) {
            authors.add(book.author);
        }
        return authors;
    } catch (error) {
        console.error('Error fetching authors:', error);
        return [];
    }
}

async function getGenres() {
    try {
        const response = await fetch('./books_db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const genres = new Set([]);
        for (let book of data.books) {
            for (let genre of book.genres) {
                genres.add(genre);
            }
        }
        return genres;
    } catch (error) {
        console.error('Error fetching authors:', error);
        return [];
    }
}

async function addAuthorsToStore() {
    try {
        const authorsSet = await getAuthors();
        const authorsArray = [...authorsSet];
        authorsArray.sort();

        const authorsList = document.getElementById('authors');

        for (let author of authorsArray) {
            const li = document.createElement('li');
            li.classList.add('dropdown-item');
            li.innerHTML = author;
            authorsList.appendChild(li);
        }
    } catch (error) {
        console.error('Error adding authors to the store list:', error);
    }
}


async function addGenresToStore() {
    try {
        const genresSet = await getGenres();
        const genresArray = [...genresSet];
        genresArray.sort();

        const genresList = document.getElementById('genres');

        for (let genre of genresArray) {
            const li = document.createElement('li');
            li.classList.add('dropdown-item');
            console.log(genre);
            li.innerHTML = genre;
            genresList.appendChild(li);
        }
    } catch (error) {
        console.error('Error adding authors to the store list:', error);
    }
}


function toggleChevron(element) {
    const span = element.getElementsByTagName('span')[0];
    if (span.classList.contains('bi-chevron-down')) {
        span.classList.remove('bi-chevron-down');
        span.classList.add('bi-chevron-up');
    } else {
        span.classList.remove('bi-chevron-up');
        span.classList.add('bi-chevron-down');
    }
}

async function fillStore() {
    try {
        const response = await fetch('./books_db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        storeProducts.innerHTML = "";

        const resultsFound = document.getElementById('resultsFound');
        resultsFound.textContent = `Found ${data.books.length} results`;

        for (const book of data.books) {
            const bookToAdd = `
                <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 ms-3 me-3">
                    <div class="card">
                        <div class="card-img-container">
                            <img class="card-img" src="assets/images/books/${book.image}" alt="${book.name}">
                        </div>    
                        <div class="card-body">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <p class="card-name">${book.name}</p>
                                <p class="card-price">$${book.price}</p>
                            </div>
                            <div class="btn-group w-100">
                                <button class="btn btn-outline-primary">
                                    <i class="bi bi-info-lg"></i>
                                </button>
                                <button class="btn btn-outline-primary">
                                    <i class="bi bi-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            storeProducts.insertAdjacentHTML('beforeend', bookToAdd);
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

async function onSearchBook() {
    try {
        const response = await fetch('./books_db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const search = document.getElementById('searchBook');

        const books = data.books.filter(b => b.name.toLowerCase().includes(search.value.toLowerCase()));
        storeProducts.innerHTML = "";

        const resultsFound = document.getElementById('resultsFound');
        resultsFound.textContent = `Found ${books.length} results`;

        for (const book of books) {
            const bookToAdd = `
                <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 ms-3 me-3">
                    <div class="card">
                        <div class="card-img-container">
                            <img class="card-img" src="assets/images/books/${book.image}" alt="${book.name}">
                        </div>    
                        <div class="card-body">
                            <div class="d-flex flex-column justify-content-center align-items-center">
                                <p class="card-name">${book.name}</p>
                                <p class="card-price">$${book.price}</p>
                            </div>
                            <div class="btn-group w-100">
                                <button class="btn btn-outline-primary">
                                    <i class="bi bi-info-lg"></i>
                                </button>
                                <button class="btn btn-outline-primary">
                                    <i class="bi bi-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            storeProducts.insertAdjacentHTML('beforeend', bookToAdd);
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}