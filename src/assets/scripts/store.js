async function fetchData(dataType) {
    try {
        const response = await fetch('https://localhost:7117/api/books', {
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const resultSet = new Set([]);
        for (let book of data) {
            if (dataType === 'authors') {
                resultSet.add(book.author);
            } else if (dataType === 'genres') {
                for (let genre of book.genres) {
                    resultSet.add(genre);
                }
                allGenres = resultSet;
            }
        }
        return resultSet;
    } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
        return [];
    }
}

let allGenres;

async function main() {
    await addDataToStore('authors');
    await addDataToStore('genres');

    await fillStore();

}

main().catch(error =>
    console.error('Error in main function:', error));


const storeProducts = document.getElementById('storeProducts');

async function addDataToStore(dataType) {
    try {
        const data = await fetchData(dataType);
        const dataArray = [...data];
        dataArray.sort();

        const dataList = document.getElementById(dataType);
        let listItemsToAdd = [];
        for (let item of dataArray) {
            const listItem = document.createElement('li');
            listItem.classList.add('dropdown-item');
            listItem.textContent = item;
            listItem.addEventListener('click', function(event) {
                event.stopPropagation();
                if (dataType === 'authors') {
                    selectAuthor(this);
                } else if (dataType === 'genres') {
                    selectGenre(this);
                }
                searchByGenresAndAuthor();
            });
            listItemsToAdd.push(listItem);
        }
        dataList.append(...listItemsToAdd);
    } catch (error) {
        console.error(`Error adding ${dataType} to the store list:`, error);
    }
}



function addBookHTML(book) {
    return `
        <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 ms-3 me-3">
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="assets/images/books/${book.imageUrl}" alt="${book.name}">
                    <p class="rating-text">${book.rating.toFixed(1)}/10</p>
                </div>    
                <div class="card-body">
                     <input type="hidden" value=${book.isbn}>
                    <div class="d-flex flex-column justify-content-center align-items-center">
                        <p class="card-name">${book.name}</p>
                        <p class="card-price">$${book.price.toFixed(2)}</p>
                    </div>
                    <div class="btn-group w-100">
                        <button class="btn btn-outline-primary">
                            <i class="bi bi-info-lg"></i>
                        </button>
                        <button class="btn btn-outline-primary" onclick="addItemToBasket('${book.isbn}')">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

function addBookHTMLAdmin(book) {
    return `
        <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 ms-3 me-3">
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="assets/images/books/${book.imageUrl}" alt="${book.name}">
                    <p class="rating-text">${book.rating.toFixed(1)}/10</p>
                </div>    
                <div class="card-body">
                     <input type="hidden" value=${book.isbn}>
                    <div class="d-flex flex-column justify-content-center align-items-center">
                        <p class="card-name">${book.name}</p>
                        <p class="card-price">$${book.price.toFixed(2)}</p>
                    </div>
                    <div class="btn-group w-100">
                        <button class="btn btn-outline-primary">
                            <i class="bi bi-info-lg"></i>
                        </button>
                        <button class="btn btn-outline-primary" onclick="addItemToBasket('${book.isbn}')">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                    <div class="btn-group w-100">
                        <button class="btn btn-outline-primary" onclick="fillEditBookWindow('${book.isbn}', '${book.name.replace(/'/g, "\\'")}', '${book.imageUrl}', '${book.author}', '${book.price}', '${book.genres.join(',')}')" type="button" data-bs-toggle="modal" data-bs-target="#modal">
                            <i class="bi bi-pen"></i>
                        </button>

                        <button class="btn btn-outline-primary" onclick="fillDeleteBookWindow('${book.isbn}', '${book.name.replace(/'/g, "\\'")}')" type="button" data-bs-toggle="modal" data-bs-target="#modal">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

async function fetchBooks() {
    const response = await fetch('https://localhost:7117/api/books');
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

async function fetchUserRole() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }
    try {
        const response = await fetch('https://localhost:7117/api/auth/userrole', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.text();
        }

        console.error('Failed to fetch user role:', response.statusText);

    } catch (error) {
        console.error('Error fetching user role:', error.message);
    }
}

async function fillStore() {
    try {
        const data = await fetchBooks();
        storeProducts.innerHTML = "";

        const resultsFound = document.getElementById('resultsFound');
        resultsFound.textContent = `Found ${data.length} results`;

        let booksToAdd = '';

        const userRole = await fetchUserRole();
        if (userRole === 'Admin') {
            for (const book of data) {
                booksToAdd += addBookHTMLAdmin(book);
            }
            booksToAdd += `
                <div class="col-xl-2 col-lg-2 col-md-3 col-sm-4 ms-3 me-3">
                    <button id="addNewBook"  onclick="fillAddBookWindow()" type="button" data-bs-toggle="modal" data-bs-target="#modal">
                        <i class="bi bi-plus"></i>
                    </button>
                    
                </div>`;
        } else {
            for (const book of data) {
                booksToAdd += addBookHTML(book);
            }
        }
        storeProducts.insertAdjacentHTML('beforeend', booksToAdd);


    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

function selectGenre(element) {
    let genres = document.querySelectorAll('#genres .dropdown-item');
    genres = Array.from(genres);

    if (element.textContent === 'All') {
        genres.forEach(function(genre) {
            if (genre.textContent === 'All') {
                genre.classList.add('active');
            } else {
                genre.classList.remove('active');
            }
        });
    } else {
        element.classList.toggle('active');
        genres.forEach(function(genre) {
            if (genre.textContent === 'All') {
                genre.classList.remove('active');
            }
        });
    }
    if (!genres.find(genre => genre.classList.contains('active'))) {
        genres[0].classList.add('active');
    }
}

function selectAuthor(element) {
    let authors = document.querySelectorAll('#authors .dropdown-item');
    authors = Array.from(authors);

    if (element.textContent === 'All') {
        authors.forEach(function(author) {
            if (author.textContent === 'All') {
                author.classList.add('active');
            } else {
                author.classList.remove('active');
            }
        });
    } else {
        element.classList.toggle('active');
        authors.forEach(function(author) {
            if (author.textContent === 'All') {
                author.classList.remove('active');
            }
        });
    }
    if (!authors.find(author => author.classList.contains('active'))) {
        authors[0].classList.add('active');
    }
}

function selectSort(element) {
    let sorts = document.querySelectorAll('#sortKinds .dropdown-item');
    sorts = Array.from(sorts);

    let selectedSort = sorts.find(sort => sort.textContent === element.textContent);

    sorts.forEach(sort => sort.classList.remove('active'));

    if (selectedSort) {
        selectedSort.classList.add('active');
    }

    return selectedSort;
}


function getSelectedGenres() {
    let activeGenres = document.querySelectorAll('#genres .dropdown-item.active');

    return Array.from(activeGenres).map(function (genre) {
        return genre.textContent;
    });
}

function getSelectedAuthors() {
    let activeAuthors = document.querySelectorAll('#authors .dropdown-item.active');

    return Array.from(activeAuthors).map(function (author) {
        return author.textContent;
    });
}

async function searchByGenresAndAuthor() {
    try {
        const data = await fetchBooks();

        const search = document.getElementById('searchBook');
        const selectedGenres = getSelectedGenres();
        const selectedAuthors = getSelectedAuthors();


        let books = data.filter(book =>
            book.name.toLowerCase().includes(search.value.trim().toLowerCase()) &&
            (selectedGenres.includes('All') || selectedGenres.some(genre => book.genres.includes(genre))) &&
            (selectedAuthors.includes('All') || selectedAuthors.some(author => book.author === author))
        );

        let sorts = document.querySelectorAll('#sortKinds .dropdown-item');
        sorts = Array.from(sorts);
        const sort = sorts.find(sort => sort.classList.contains('active'));
        switch (sort.textContent) {
            case 'Popularity':
                books.sort((a, b) => b.rating - a.rating);
                break;
            case 'Price (ascending)':
                books.sort((a, b) => a.price - b.price);
                break;
            case 'Price (descending)':
                books.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        storeProducts.innerHTML = "";

        const resultsFound = document.getElementById('resultsFound');
        resultsFound.textContent = `Found ${books.length} results`;

        let booksToAdd = '';
        for (const book of books) {
            booksToAdd += addBookHTML(book);
        }
        storeProducts.insertAdjacentHTML('beforeend', booksToAdd);

    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}


// basket handling
function addItemToBasket(isbn) {
    const basketItems = localStorage.getItem('basketItems');
    let newBasketItems = basketItems ? JSON.parse(basketItems) : [];

    const existingItemIndex = newBasketItems.findIndex(item => item.isbn === isbn);

    if (existingItemIndex !== -1) {
        newBasketItems[existingItemIndex].quantity += 1;
    } else {
        newBasketItems.push({ isbn: isbn, quantity: 1 });
    }

    localStorage.setItem('basketItems', JSON.stringify(newBasketItems));
    setBasketItemsCount();

    let hours = 240;
    let now = new Date().getTime();
    let setupTime = localStorage.getItem('setupTime');

    if (setupTime == null) {
        let newSetupTime = new Date(now + hours * 60 * 60 * 1000);
        let setupTimeString = newSetupTime.toISOString();

        localStorage.setItem('setupTime', setupTimeString);
    } else {
        let storedSetupTime = new Date(setupTime);

        if (now - storedSetupTime.getTime() > hours * 60 * 60 * 1000) {
            localStorage.clear();
            localStorage.setItem('setupTime', now);
        }
    }

}
