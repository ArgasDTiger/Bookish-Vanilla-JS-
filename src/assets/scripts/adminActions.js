

async function fillEditBookWindow(isbn, title, imageUrl, author, price, currentGenres) {
    currentGenres = currentGenres.split(',');

    const modalElement = document.getElementById('modal-content');
    modalElement.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="authLabel">Editing «${title}»</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <form id="bookEditForm" class="form-signin d-flex justify-content-center align-items-center flex-column">
            <h2 id="editBookTextAlert" class="h5 text-danger"></h2>
            <input id="bookIsbn" type="hidden" value="${isbn}">
            <label for="bookTitle" class="sr-only ms-1 me-auto">Title</label>
            <input type="text" id="bookTitle" class="form-control" value="${title}" required>
            <label for="bookImage" class="sr-only ms-1 me-auto">Image</label>
            <input type="text" id="bookImage" class="form-control" value="${imageUrl}" required>
            <label for="bookAuthor" class="sr-only ms-1 me-auto">Author</label>
            <input type="text" id="bookAuthor" class="form-control" value="${author}" required>
            <label for="bookPrice" class="sr-only ms-1 me-auto">Price</label>
            <input type="text" id="bookPrice" class="form-control" value="${price}" required>
            <label for="bookGenres" class="sr-only ms-1 me-auto">Genres</label>
            <select id="bookGenres" class="form-control" multiple required>
                ${[...allGenres].map(genre => `<option value="${genre}" ${currentGenres.includes(genre) ? 'selected' : ''}>${genre}</option>`).join('')}
            </select>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
        </form>
    </div>`;
    document.getElementById('bookEditForm').addEventListener('submit', updateBook);
}

async function fillDeleteBookWindow(isbn, title) {
    const modalElement = document.getElementById('modal-content');
    modalElement.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="authLabel">About to delete «${title}»</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <form id="bookDeleteForm" class="form-signin d-flex justify-content-center align-items-center flex-column">
            <input id="bookIsbn" type="hidden" value="${isbn}">
            <h2 id="editBookTextAlert" class="h5 text-danger"></h2>
            <p>After clicking «Delete» button, book «${title}» is going to be deleted from the store. Are you sure you want to do that?</p>
            <div class="d-flex">
                <button type="button" class="btn btn-secondary d-inline-flex" data-bs-dismiss="modal">Close</button>
                <button class="btn btn-danger ms-2  d-inline-flex" type="submit">Delete</button>
            </div>
        </form>
    </div>`;
    document.getElementById('bookDeleteForm').addEventListener('submit', deleteBook);
}

function fillAddBookWindow() {
    const modalElement = document.getElementById('modal-content');
    modalElement.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="authLabel">Creating</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <form id="bookCreateForm" class="form-signin d-flex justify-content-center align-items-center flex-column">
            <h2 id="createBookTextAlert" class="h5 text-danger"></h2>
            <label for="bookIsbn" class="sr-only ms-1 me-auto">ISBN</label>
            <input type="text" id="bookIsbn" class="form-control" required>            
            <label for="bookTitle" class="sr-only ms-1 me-auto">Title</label>
            <input type="text" id="bookTitle" class="form-control" required>
            <label for="bookImage" class="sr-only ms-1 me-auto">Image</label>
            <input type="text" id="bookImage" class="form-control" required>
            <label for="bookAuthor" class="sr-only ms-1 me-auto">Author</label>
            <input type="text" id="bookAuthor" class="form-control" required>
            <label for="bookRating" class="sr-only ms-1 me-auto">Rating</label>
            <input type="number" step="0.01" id="bookRating" class="form-control" required>
            <label for="bookPublishDate" class="sr-only ms-1 me-auto">Date of Publish</label>
            <input type="date" id="bookPublishDate" class="form-control" required>
            <label for="bookPrice" class="sr-only ms-1 me-auto">Price</label>
            <input type="number" step="0.01" id="bookPrice" class="form-control" required>
            <label for="bookGenres" class="sr-only ms-1 me-auto">Genres</label>
            <select id="bookGenres" class="form-control" multiple required>
                ${[...allGenres].map(genre => `<option value="${genre}">${genre}</option>`).join('')}
            </select>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Submit</button>
        </form>
    </div>`;
    document.getElementById('bookCreateForm').addEventListener('submit', createBook);
}



async function updateBook() {
    event.preventDefault();
    const isbn = document.getElementById('bookIsbn').value;
    const title = document.getElementById('bookTitle').value;
    const image = document.getElementById('bookImage').value;
    const author = document.getElementById('bookAuthor').value;
    const price = document.getElementById('bookPrice').value;
    const genresElement = document.getElementById('bookGenres');
    const genres = Array.from(genresElement.selectedOptions).map(option => option.value);

    const token = localStorage.getItem('token');

    const book = {
        ISBN: isbn,
        Name: title,
        ImageUrl: image,
        Author: author,
        Price: price,
        Genres: genres
    }
    await fetch(`https://localhost:7117/api/books/${isbn}`, {
        method: "PUT",
        body: JSON.stringify(book),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const editBookTextAlert = document.getElementById('editBookTextAlert');
            editBookTextAlert.textContent = 'Something went wrong saving the changes!';
            editBookTextAlert.style.visibility = 'visible';
            throw new Error(`Server responded: ${await response.text()}`);
        }
    })
    .then(data => {
        location.reload();
    })
    .catch(error => {
        const editBookTextAlert = document.getElementById('editBookTextAlert');
        editBookTextAlert.textContent = 'Server error occurred! Please try again!';
        editBookTextAlert.style.visibility = 'visible';

        console.error('Error updating book:', error);
    });

}

async function deleteBook() {
    event.preventDefault();
    const isbn = document.getElementById('bookIsbn').value;
    const token = localStorage.getItem('token');

    await fetch(`https://localhost:7117/api/books/${isbn}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Server responded: ${await response.text()}`);
            }
        })
        .then(data => {
            location.reload();
        })
        .catch(error => {
            const editBookTextAlert = document.getElementById('editBookTextAlert');
            editBookTextAlert.textContent = 'Server error occured! Please try again!';
            editBookTextAlert.style.visibility = 'visible';

            console.error('Error deleting book:', error);
        });

}

async function createBook() {
    event.preventDefault();
    const isbn = document.getElementById('bookIsbn').value;
    const title = document.getElementById('bookTitle').value;
    const image = document.getElementById('bookImage').value;
    const author = document.getElementById('bookAuthor').value;
    const price = document.getElementById('bookPrice').value;
    const publishDate = document.getElementById('bookPublishDate').value;
    const rating = document.getElementById('bookRating').value;
    const genresElement = document.getElementById('bookGenres');
    const genres = Array.from(genresElement.selectedOptions).map(option => option.value);

    const token = localStorage.getItem('token');

    const book = {
        ISBN: isbn,
        Name: title,
        ImageUrl: image,
        Author: author,
        Price: price,
        PublishingDate: publishDate,
        Rating: rating,
        Genres: genres
    }
    await fetch(`https://localhost:7117/api/books`, {
        method: "POST",
        body: JSON.stringify(book),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                const createBookTextAlert = document.getElementById('createBookTextAlert');
                createBookTextAlert.textContent = 'Something went wrong saving the changes!';
                createBookTextAlert.style.visibility = 'visible';
                throw new Error(`Server responded: ${await response.text()}`);
            }
        })
        .then(data => {
            location.reload();
        })
        .catch(error => {
            const createBookTextAlert = document.getElementById('createBookTextAlert');
            createBookTextAlert.textContent = 'Server error occurred! Please try again!';
            createBookTextAlert.style.visibility = 'visible';

            console.error('Error updating book:', error);
        });

}