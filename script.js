
const apiKey = "Z45NN5ZMF8B77N8O";
const stockChart = document.getElementById("stockChart").getContext("2d");
let chart;

async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function renderStockChart(data, symbol) {
    const timeSeries = data["Time Series (Daily)"];
    const dates = Object.keys(timeSeries).slice(0, 30).reverse(); // Get the last 30 days
    const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));

    if (chart) {
        chart.destroy(); // Destroy the previous chart
    }

    chart = new Chart(stockChart, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: `${symbol} Stock Price`,
                    data: prices,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
        },
    });
}

function renderStockDetails(data, symbol) {
    const metaData = data["Meta Data"];
    const timeSeries = data["Time Series (Daily)"];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];

    const stockDetailsDiv = document.getElementById("stockDetails");
    stockDetailsDiv.innerHTML = `
        <p><strong>Symbol:</strong> ${symbol}</p>
        <p><strong>Date:</strong> ${latestDate}</p>
        <p><strong>Open:</strong> ${latestData["1. open"]}</p>
        <p><strong>High:</strong> ${latestData["2. high"]}</p>
        <p><strong>Low:</strong> ${latestData["3. low"]}</p>
        <p><strong>Close:</strong> ${latestData["4. close"]}</p>
        <p><strong>Volume:</strong> ${latestData["5. volume"]}</p>
    `;
}

document.getElementById("searchButton").addEventListener("click", async () => {
    const stockSymbol = document.getElementById("stockSearch").value.trim().toUpperCase();
    if (stockSymbol) {
        try {
            const stockData = await fetchStockData(stockSymbol);
            if (stockData["Error Message"]) {
                alert("Stock not found. Please try another symbol.");
            } else {
                renderStockChart(stockData, stockSymbol);
                renderStockDetails(stockData, stockSymbol);
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            alert("Failed to fetch stock data. Please try again later.");
        }
    } else {
        alert("Please enter a stock symbol.");
    }
});






const stockTableBody = document.querySelector("#StockTable tbody");

async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function updateComparisonTable(symbol, data) {
    const timeSeries = data["Time Series (Daily)"];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];

    const price = parseFloat(latestData["4. close"]).toFixed(2);
    const openPrice = parseFloat(latestData["1. open"]).toFixed(2);
    const change = (price - openPrice).toFixed(2);
    const volume = latestData["5. volume"];

    // Create a new row for the stock
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${symbol}</td>
        <td>$${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
    `;

    // Add the new row to the table body
    stockTableBody.appendChild(newRow);
}

document.getElementById("searchButton").addEventListener("click", async () => {
    const stockSymbol = document.getElementById("stockSearch").value.trim().toUpperCase();
    if (stockSymbol) {
        try {
            const stockData = await fetchStockData(stockSymbol);
            if (stockData["Error Message"]) {
                alert("Stock not found. Please try another symbol.");
            } else {
                renderStockChart(stockData, stockSymbol);
                renderStockDetails(stockData, stockSymbol);
                updateComparisonTable(stockSymbol, stockData);
            }
        } catch (error) {
            console.error("Error fetching stock data:", error);
            alert("Failed to fetch stock data. Please try again later.");
        }
    } else {
        alert("Please enter a stock symbol.");
    }
});


