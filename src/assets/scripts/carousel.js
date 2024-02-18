const targetNode = document.querySelector('.track');

const config = { childList: true };

const callback = function(mutationsList) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const prev = document.querySelector('.prev');
            const next = document.querySelector('.next');
            const rowWidth = document.querySelector('.carousel-container').offsetWidth;
            const cardWidth = document.querySelector('.card-container').offsetWidth;
            const track = document.querySelector('.track');
            const cardsCount = document.querySelectorAll('.track .card-container').length;

            const elementsInRow = Math.ceil(rowWidth / cardWidth);
            let currentPosition = 0;
            next.addEventListener('click', () => {
                if (currentPosition + cardWidth * elementsInRow < cardsCount * cardWidth) {
                    currentPosition += cardWidth * elementsInRow;
                    track.style.transition = 'transform 0.3s ease';
                }
                track.style.transform = `translateX(-${currentPosition}px)`;
            });

            prev.addEventListener('click', () => {
                if (currentPosition > cardWidth * elementsInRow) {
                    currentPosition -= cardWidth * elementsInRow;
                    track.style.transition = 'transform 0.3s ease';
                } else {
                    currentPosition = 0;
                    track.style.transition = 'transform 0.3s ease';
                }
                track.style.transform = `translateX(-${currentPosition}px)`;
            });
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

window.addEventListener('resize', function() {
    callback([], observer);
});
