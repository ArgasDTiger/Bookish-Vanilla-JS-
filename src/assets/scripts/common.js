var dropdowns = document.getElementsByClassName("btn btn-link d-inline-block");

for (let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener('click', function() {
        for (let j = 0; j < dropdowns.length; j++) {
            if (j !== i && dropdowns[j].getAttribute('aria-expanded') === 'true') {
                dropdowns[j].click();
            }
        }
    });
}
