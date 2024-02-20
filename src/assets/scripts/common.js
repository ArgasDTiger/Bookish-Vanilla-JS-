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
