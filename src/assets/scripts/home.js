const homepageBookList = document.getElementById('homepage-book-list');

addBooksOnHomepage();

function addBooksOnHomepage() {
    fetch('https://localhost:7117/api/books')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            homepageBookList.innerHTML = "";
            for (let book of data) {
                const container = `
                    <div class="card-container">
                        <div class="card">
                            <div class="window">
                                <img src="./assets/images/books/${book.imageUrl}" alt="${book.name}" class="img">
                                <p class="info">${book.name}</p>
                            </div>
                        </div>
                    </div>`;
                homepageBookList.insertAdjacentHTML('beforeend', container);
            }

        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}
