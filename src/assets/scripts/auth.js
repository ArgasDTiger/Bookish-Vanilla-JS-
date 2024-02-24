async function signIn(event) {
    event.preventDefault();
    try {
        const response = await fetch('./users_db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const emailValue = document.getElementById('signInEmail').value;
        const passwordValue = document.getElementById('signInPassword').value;
        const signInForm = document.getElementById('signInForm');
        let textAlert = signInForm.getElementsByClassName('text-danger')[0];

        for (let user of data.users) {
            if (user.email === emailValue && user.password === passwordValue) {
                localStorage.setItem('key', `${user.email}`)
                // textAlert.removeAttribute('style');
                location.reload();
            } else {
                textAlert.setAttribute('style', 'display: block');
            }
        }
    } catch (error) {
        console.error(`Error fetching:`, error);
    }
}

async function signUp(event) {
    event.preventDefault();
    try {
        const response = await fetch('./users_db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const signUpForm = document.getElementById('signUpForm');
        const emailValue = document.getElementById('signUpEmail').value;
        const displayNameValue = document.getElementById('signUpDisplayName').value;
        const passwordValue = document.getElementById('signUpPassword').value;

        let textAlerts = signUpForm.getElementsByClassName('text-danger');
        let isFormValid = true;

        for (let textAlert of textAlerts) {
            textAlert.removeAttribute('style');
        }

        for (let user of data.users) {
            if (user.email === emailValue) {
                textAlerts[0].setAttribute('style', 'display: block');
                isFormValid = false;
            }
        }
        if (!emailValue.match('^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$')) {
            textAlerts[0].textContent = 'Email is not valid';
            textAlerts[0].setAttribute('style', 'display: block');
            isFormValid = false;
        }
        if (displayNameValue.length < 3) {
            textAlerts[1].setAttribute('style', 'display: block');
            isFormValid = false;
        }
        if (passwordValue.length < 8) {
            textAlerts[2].setAttribute('style', 'display: block');
            isFormValid = false;
        }

        if (isFormValid) {
            const newUser = {
                email: emailValue,
                displayName: displayNameValue,
                password: passwordValue
            };

            data.users.push(newUser);

            console.log('User added successfully!');
            console.log(data.users);
        }

    } catch (error) {
        console.error(`Error signing up:`, error);
    }
}


function onAccountExit() {
    if (localStorage.getItem('key') !== null) {
        localStorage.removeItem('key');
        location.reload();
    }
}