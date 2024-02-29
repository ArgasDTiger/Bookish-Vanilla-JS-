let myChart;
displayInitialChart();
fillProfile();

function updateChart(data, labels, chartType) {
    if (myChart) {
        myChart.destroy();
    }
    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'The most popular books in basket',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


async function prepareChartData() {
    const basketItems = JSON.parse(localStorage.getItem('basketItems'));
    let bookCount = {};

    if (basketItems) {
        let isbns = basketItems.map(item => item.isbn);

        let url = new URL('https://localhost:7117/api/books/isbns');
        isbns.forEach(isbn => url.searchParams.append('isbns', isbn));

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        for (let item of basketItems) {
            let book = data.find(book => book.isbn === item.isbn);
            bookCount[book.name] = item.quantity;
        }
    }

    let data = [];
    let labels = [];

    for (let name in bookCount) {
        if (bookCount.hasOwnProperty(name)) {
            labels.push(name);
            data.push(bookCount[name]);
        }
    }

    return { data: data, labels: labels };
}

async function displayInitialChart() {
    let initialChartData = await prepareChartData();
    updateChart(initialChartData.data, initialChartData.labels, 'pie');
}

async function selectChart(element) {
    let charts = document.querySelectorAll('#chartTypes .dropdown-item');
    charts = Array.from(charts);

    let chartTypeMap = {
        "Pie Chart": "pie",
        "Bar Chart": "bar",
        "Line Chart": "line"
    };
    let selectedChart = charts.find(chart => chart.textContent === element.textContent);

    charts.forEach(chart => chart.classList.remove('active'));

    let chartType;
    if (selectedChart) {
        selectedChart.classList.add('active');
        chartType = chartTypeMap[selectedChart.textContent];
    }

    let chartData = await prepareChartData();
    updateChart(chartData.data, chartData.labels, chartType);
}

async function fillProfile() {
    let mainContainer = document.getElementsByTagName('main')[0];
    const token = localStorage.getItem('token');
    if (!token) {
        mainContainer.textContent = "";
        mainContainer.insertAdjacentHTML('beforeend', '<h1>Only authenticated users can access the basket!</h1>');
        return;
    }
    await fetch(`https://localhost:7117/api/auth/userinfo`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Server responded: ${await response.text()}`);
            }
            return response.json();
        })
        .then(data => {
            const profileUl = document.getElementById('profileUl');
            profileUl.innerHTML = `
                <li><img id="profileImg" src="assets/images/profile.png" alt=""></li>
                <li>${data.displayName}</li>
                <li>${data.email}</li>
                <li>${data.role}</li>`;
        })
        .catch(error => {
            console.error('Error filling profile:', error);
        });
}
