let mainContainer = document.getElementsByTagName('main')[0];


fillBasket();

async function fillBasket() {
    if (localStorage.getItem('token') === null) {
        mainContainer.textContent = "";
        mainContainer.insertAdjacentHTML('beforeend', '<h1>Only authenticated users can access the basket!</h1>');
        return;
    }
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));
    let isbns = [];
    for (let basketItem of basketItems) {
        isbns.push(basketItem.isbn);
    }

    let url = new URL('https://localhost:7117/api/books/isbns');
    isbns.forEach(isbn => url.searchParams.append('isbns', isbn));

    const response = await fetch(url, {
        method: 'GET',
            headers: {
            'Content-Type': 'application/json',
        },
    });

    let total = 0;

    const data = await response.json();
    let result = '';
    if (data.length > 0) {
        for (let book of data) {
            let booksInBasket = getBooksQuantityInBasket(book.isbn);
            const row = addBasketRowHTML(book, booksInBasket);
            result += row;

            total += booksInBasket * book.price;
        }
        const basketTotal = document.getElementById('basketTotal');
        basketTotal.textContent = `$${total.toFixed(2)}`;
    }


    const basketTbody = document.getElementById('basketTbody');
    basketTbody.textContent = '';
    basketTbody.insertAdjacentHTML('beforeend', result);



}

function addBasketRowHTML(book, quantity) {
    return `<tr>
                <th class="basket-row-header" scope="row">
                    <img src="assets/images/books/${book.imageUrl}" alt="${book.name}">
                    <p>${book.name}</p>
                    <i class="bi bi-trash" onclick="removeBookFromBasket('${book.isbn}')"></i>
                </th>
                <td id="basketPrice-${book.isbn}">$${book.price}</td>
                <td>
                    <i class="bi bi-dash" onclick="basketMinus('${book.isbn}')"></i>
                    <p id="basketQuantity-${book.isbn}" class="d-inline-flex">${quantity}</p>
                    <i class="bi bi-plus" onclick="basketPlus('${book.isbn}')"></i>
                </td>
                <td id="basketSubtotal-${book.isbn}">$${(book.price * quantity).toFixed(2)}</td>
            </tr>`;
}
function getBooksQuantityInBasket(isbn) {
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));
    return basketItems.find(i => i.isbn === isbn).quantity;
}

function basketMinus(isbn) {
    const itemQuantity = document.getElementById(`basketQuantity-${isbn}`);
    const itemSubtotal = document.getElementById(`basketSubtotal-${isbn}`);
    const basketTotal = document.getElementById('basketTotal');
    const itemPrice = document.getElementById(`basketPrice-${isbn}`);

    if (itemQuantity.textContent - 1 !== 0) {
        let basketItems = JSON.parse(localStorage.getItem('basketItems'));
        const indexOfItem = basketItems.findIndex(item => item.isbn === isbn);

        basketItems[indexOfItem].quantity--;
        localStorage.setItem('basketItems', JSON.stringify(basketItems));
        itemQuantity.textContent--;

        itemSubtotal.textContent = `$${(basketItems[indexOfItem].quantity * itemPrice.textContent.substring(1)).toFixed(2)}`;
        basketTotal.textContent = `$${(+basketTotal.textContent.substring(1) - +itemPrice.textContent.substring(1)).toFixed(2)}`;

    }
}

function basketPlus(isbn) {
    const itemQuantity = document.getElementById(`basketQuantity-${isbn}`);
    const itemSubtotal = document.getElementById(`basketSubtotal-${isbn}`);
    const basketTotal = document.getElementById('basketTotal');
    const itemPrice = document.getElementById(`basketPrice-${isbn}`);

    let basketItems = JSON.parse(localStorage.getItem('basketItems'));
    const indexOfItem = basketItems.findIndex(item => item.isbn === isbn);

    basketItems[indexOfItem].quantity++;
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
    itemQuantity.textContent++;

    itemSubtotal.textContent = `$${(basketItems[indexOfItem].quantity * itemPrice.textContent.substring(1)).toFixed(2)}`;
    basketTotal.textContent = `$${(+basketTotal.textContent.substring(1) + +itemPrice.textContent.substring(1)).toFixed(2)}`;
}

function removeBookFromBasket(isbn) {
    let basketItems = JSON.parse(localStorage.getItem('basketItems'));
    const itemSubtotal = document.getElementById(`basketSubtotal-${isbn}`);
    const basketTotal = document.getElementById('basketTotal');

    basketTotal.textContent = `$${(+basketTotal.textContent.substring(1) - +itemSubtotal.textContent.substring(1)).toFixed(2)}`;

    basketItems = basketItems.filter(item => item.isbn !== isbn);

    localStorage.setItem('basketItems', JSON.stringify(basketItems));
    setBasketItemsCount();
    fillBasket();
}