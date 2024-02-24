const homepageBookList = document.getElementById('homepage-book-list');

addBooksOnHomepage();

function createDiv(classes) {
    let div = document.createElement('div');
    if (typeof classes === 'string') {
        classes = classes.split(' ');
    }
    if (Array.isArray(classes)) {
        classes.forEach(cls => {
            div.classList.add(cls.trim());
        });
    }
    return div;
}

function addBooksOnHomepage() {
    fetch('./books_db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            homepageBookList.innerHTML = "";
            for (let book of data.books) {
                let container = createDiv('card-container'),
                    card = createDiv('card'),
                    window = createDiv('window');

                const image = document.createElement('img');
                image.src = './assets/images/books/' + book.image;
                image.alt = book.name;
                image.classList.add('img');

                const p = document.createElement('p');
                p.innerHTML = book.name;
                p.classList.add('info');

                window.appendChild(image);
                window.appendChild(p);
                card.appendChild(window);
                container.appendChild(card);

                homepageBookList.appendChild(container);
            }
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });
}
