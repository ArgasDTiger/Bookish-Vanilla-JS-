//overall dropdown clicks

let dropdowns = document.getElementsByClassName("btn btn-link d-inline-block");

function closeDropdowns() {
    for (let j = 0; j < dropdowns.length; j++) {
        if (dropdowns[j].getAttribute('aria-expanded') === 'true') {
            dropdowns[j].click();
        }
    }
}

document.addEventListener('click', function(event) {
    if (!event.target.matches('.btn.btn-link.d-inline-block')) {
        closeDropdowns();
    }
});

for (let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener('click', function(event) {
        event.stopPropagation();
        for (let j = 0; j < dropdowns.length; j++) {
            if (j !== i && dropdowns[j].getAttribute('aria-expanded') === 'true') {
                dropdowns[j].click();
            }
        }
    });
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

//profile dropdown
fillProfileDropdown();
function fillProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    let ul = profileDropdown.getElementsByTagName('ul')[0];
    let basketItemsCount = document.getElementById('basketItemsCount');
    ul.textContent = '';
    let ulContent;
    if (localStorage.getItem('token') === null) {
        ulContent = `<li class="dropdown-item" onclick="fillSignInWindow()" type="button" data-bs-toggle="modal" data-bs-target="#modal">Login</li>
                     <li class="dropdown-item" onclick="fillSignUpWindow()" type="button" data-bs-toggle="modal" data-bs-target="#modal">Register</li>`
    } else {
        ulContent = `<li class="dropdown-item"><a href="profile.html" class="text-decoration-none">My Profile</a></li>
                     <li class="dropdown-item" onclick="onAccountExit()">Exit</li>`
        basketItemsCount.style.visibility = 'visible';
    }
    ul.insertAdjacentHTML('beforeend', ulContent);
}

function fillSignInWindow() {
    const modalElement = document.getElementById('modal-content');
    modalElement.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title" id="signInLabel">Sign In</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <form id="signInForm" class="form-signin d-flex justify-content-center align-items-center flex-column">
                <h1 class="h3 font-weight-normal">Please enter your data</h1>
                <h2 class="h5 text-danger">Wrong data entered!</h2>
                <label for="signInEmail" class="sr-only ms-1 me-auto">Email address</label>
                <input type="email" id="signInEmail" class="form-control mb-2" placeholder="Email address" required>
                <label for="signInPassword" class="sr-only ms-1 me-auto">Password</label>
                <div class="input-group mb-2">
                    <input type="password" id="signInPassword" class="form-control" placeholder="Password" required>
                    <div class="input-group-append">
                        <span class="input-group-text">
                            <i id="togglePassword" class="bi bi-eye-fill"></i>
                        </span>
                    </div>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
            </form>
        </div>`;
    document.getElementById('signInForm').addEventListener('submit', signIn);
    const togglePassword = document.querySelector('#togglePassword');
    const passwordField = document.querySelector('#signInPassword');
    togglePassword.addEventListener('click', function (e) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('bi-eye-slash-fill');
    });
}




function fillSignUpWindow() {
    const modalElement = document.getElementById('modal-content');
    modalElement.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="authLabel">Sign Up</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <form id="signUpForm" class="form-signin d-flex justify-content-center align-items-center flex-column">
            <h1 class="h3 mb-3 font-weight-normal">Please enter your data</h1>
            <label for="signUpEmail" class="sr-only ms-1 me-auto">Email address</label>
            <input type="email" id="signUpEmail" class="form-control" placeholder="Email address" required>
            <p class="text-danger me-auto">Email is already in use</p>
            <label for="signUpDisplayName" class="sr-only ms-1 me-auto">Display Name</label>
            <input type="text" id="signUpDisplayName" class="form-control" placeholder="Display Name" required>
            <p class="text-danger me-auto">Display Name should contain at least 3 characters</p>
            <label for="signUpPassword" class="sr-only ms-1 me-auto">Password</label>
            <div class="input-group mb-2">
                <input type="password" id="signUpPassword" class="form-control" placeholder="Password" required>
                <div class="input-group-append">
                    <span class="input-group-text">
                        <i id="togglePassword" class="bi bi-eye-fill"></i>
                    </span>
                </div>
            </div>
            <p class="text-danger me-auto">Password is too weak (special characters, number, min 8 symbols)</p>
            <label for="confirmPassword" class="sr-only ms-1 me-auto">Confirm Password</label>
            <div class="input-group mb-2">
                <input type="password" id="confirmPassword" class="form-control" placeholder="Password" required>
                <div class="input-group-append">
                    <span class="input-group-text">
                        <i id="toggleConfirmPassword" class="bi bi-eye-fill"></i>
                    </span>
                </div>
            </div>
            <p class="text-danger me-auto">Passwords do not match</p>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
    </div>`;
    document.getElementById('signUpForm').addEventListener('submit', signUp);

    const togglePassword = document.querySelector('#togglePassword');
    const passwordField = document.querySelector('#signUpPassword');
    togglePassword.addEventListener('click', function (e) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('bi-eye-slash-fill');
    });

    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const confirmPasswordField = document.querySelector('#confirmPassword');
    toggleConfirmPassword.addEventListener('click', function (e) {
        const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordField.setAttribute('type', type);
        this.classList.toggle('bi-eye-slash-fill');
    });
}



// basket
setBasketItemsCount();
function setBasketItemsCount() {
    const basketItems = localStorage.getItem('basketItems');
    let basketItemsCount = document.getElementById('basketItemsCount');
    basketItemsCount.textContent = basketItems === null ? 0 : JSON.parse(basketItems).length;
}


// scroll
window.addEventListener('scroll', function() {
    const returnToTop = document.getElementById('return-to-top');
    if (window.pageYOffset >= (document.documentElement.scrollHeight / 3)) {
        returnToTop.style.display = 'block'; // Show the arrow
    } else {
        returnToTop.style.display = 'none'; // Hide the arrow
    }
});

document.getElementById('return-to-top').addEventListener('click', function() {
    window.scrollTo(0, 0); // Scroll to top of the page instantly
});



//spam
/*
if (localStorage.getItem('offerAgreed') === null) {
    setTimeout(() => {
        const specialOfferToast = document.getElementById('specialOfferToast')
        const specialOfferToastBootstrap = bootstrap.Toast.getOrCreateInstance(specialOfferToast)

        specialOfferToastBootstrap.show();

        let intervalId = setInterval(() => {
            if (localStorage.getItem('offerAgreed') !== null) {
                clearInterval(intervalId);
            } else {
                specialOfferToastBootstrap.show();
            }
        }, 30000);

    }, 3000);
}

function onSpecialOfferAgree() {
    localStorage.setItem('offerAgreed', 'true');
    const specialOfferToast = document.getElementById('specialOfferToast')
    const specialOfferToastBootstrap = bootstrap.Toast.getOrCreateInstance(specialOfferToast)

    specialOfferToastBootstrap.hide();
}

let advertisementClosed = false;
window.addEventListener('scroll', function() {
    const totalHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.pageYOffset;
    const scrollPercentage = (scrollPosition / totalHeight) * 100;

    if (scrollPercentage > 30 && !advertisementClosed) {
        const advertisementModal = document.getElementById('advertisementModal');
        const modal = new bootstrap.Modal(advertisementModal);
        modal.show();
        advertisementClosed = true;

        let advertisementCounter = document.getElementById('advertisementCounter');
        let interval = setInterval(() => {
            advertisementCounter.textContent = --advertisementCounter.textContent;
            if (advertisementCounter.textContent <= 0) {
                advertisementCounter.textContent = '';
                clearInterval(interval);
                let modalContentButtons = document.getElementsByTagName('button');
                for (let btn of modalContentButtons) {
                    btn.disabled = false;
                }
            }
        }, 1000);
    }
});
*/
