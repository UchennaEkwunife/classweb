function sayHello() {
  alert("Hello, world!");
}

function changeColor(color) {
  document.body.style.backgroundColor = color;
}

function navigateTo(page) {
  const lowercasePage = page.toLowerCase();
  window.location.href = `${lowercasePage}.html`;
}

let isAudioOn = true;

function toggleAudio() {
  if (isAudioOn) {
    // Turn off
    annyang.pause();
  } else {
    // Turn on
    annyang.resume();
  }

  // Update the audio state
  isAudioOn = !isAudioOn;
}

// Function to fetch and display a random quote
async function displayRandomQuote() {
  const quoteContainer = document.getElementById("quote");

  try {
    // Fetch a single random quote from the free API endpoint
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();

    quoteContainer.textContent = data[0].q;
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    quoteContainer.textContent =
      "Failed to fetch quote. Please try again later.";
  }
}

const dogApiUrl='https://dog.ceo/api/breeds/image/random/10';

fetch(dogApiUrl)
    .then(response => response.json())
    .then(data =>{
        displayDogImages(data.message);
    })

function displayDogImages(images){
    const container =document.getElementById("dogCarousel");
        
    images.forEach(imageUrl=>{
        const imgElement=document.createElement('img');
        imgElement.src=imageUrl;
        imgElement.alt='Dog Image';
        container.appendChild(imgElement);
    });

}

// Function to load dog breed information and images
async function loadDogBreedInfo(breed) {
  const dogInfoContainer = document.getElementById("dogInfoContainer");

  try {
    // Fetch dog breed infor
    const breedResponse = await fetch(
      `https://dog.ceo/api/breeds/image/random/10`
    );
    const breedData = await breedResponse.json();

    // Update the DOM elements
    document.getElementById("breedName").textContent = "breedInformation.data.attributes.name"; 
    document.getElementById("breedDescription").textContent =
      "name"; // 
    document.getElementById("minLife").textContent = "minLife";
    document.getElementById("maxLife").textContent = "maxLife";
    
    dogInfoContainer.style.display = "block";

    displayImagesInCarousel(breedData.message);
  } catch (error) {
    console.error("Error fetching random dog information:", error.message);

    dogInfoContainer.textContent =
      "Failed to fetch random dog information. Please try again later.";
  }
}

// Fetch list of breeds
fetch("https://dogapi.dog/api/v2/breeds")
  .then((response) => response.json())
  .then((data) => {
    const breeds = data.data;

    breeds.forEach((breed) => {
      const button = document.createElement("button");
      button.textContent = breed.attributes.name;
      button.classList.add("dog-breed-button", "button-56");
      button.addEventListener("click", function () {
        loadDogBreedInfo(breed.id);
      });
      buttonsContainer.appendChild(button);
    });
  })
  .catch((error) => console.error("Error fetching breeds:", error));

// Stock

async function lookupStock(stock) {
  const stockChartContainer = document.getElementById("stockChartContainer");
  const selectedDuration = document.querySelector(
    'input[name="duration"]:checked'
  ).value;
  const apiKey = "jKSpnQZedPmZVdprypvSC13kHxsyPCLl";

  try {
    // Fetch stock data from Polygon.IO API
    const stockResponse = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/${selectedDuration}/?apiKey=${jKSpnQZedPmZVdprypvSC13kHxsyPCLl}`
    );
    const stockData = await stockResponse.json();

    // Process and display the stock data using Chart.js
    const dates = stockData.results.map((result) => new Date(result.t));
    const closingValues = stockData.results.map((result) => result.c);

    // Create a line chart using Chart.js
    const ctx = document.getElementById("stockChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: `Stock: ${stock}`,
            data: closingValues,
            borderColor: "blue",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
          },
          y: {
            title: {
              display: true,
              text: "Closing Value",
            },
          },
        },
      },
    });

    stockChartContainer.style.display = "block";

    loadStockImages(stock);
  } catch (error) {
    console.error(`Error looking up stock ${stock}:`, error.message);

    stockChartContainer.textContent = `Failed to lookup stock ${stock}. Please try again later.`;
  }
}

function loadTop5Stocks() {
  fetch("https://tradestie.com/api/v1/apps/reddit")
    .then((response) => response.json())
    .then((data) => {
      const stocksListContainer = document.getElementById(
        "stocksListContainer"
      );

      data.data.children.slice(0, 5).forEach((stock) => {
        const ticker = stock.data.title.split(" ")[0];
        const commentCount = stock.data.num_comments;
        const sentiment =
          stock.data.likes > stock.data.dislikes ? "Bullish" : "Bearish";

        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>${ticker}</td>
                        <td>${commentCount}</td>
                        <td>${sentiment} <img src="${
          sentiment === "Bullish" ? "bullish_icon.png" : "bearish_icon.png"
        }" alt="${sentiment}"></td>
                    `;

        stocksListContainer.appendChild(row);
      });
    })
    .catch((error) =>
      console.error("Error fetching top 5 stocks from Reddit:", error)
    );
}

// Load top 5 stocks on page load
document.addEventListener("DOMContentLoaded", loadTop5Stocks);

async function loadStockImages(stock) {
  const imagesContainer = document.getElementById("stockImagesContainer");

  try {
    // Fetch stock images
    const response = await fetch(
      `https://tradestie.com/api/v1/apps/reddit/images`
    );

    const data = await response.json();

    // Display the stock images
    data.images.forEach((imageUrl) => {
      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = "Stock Image";
      imagesContainer.appendChild(imgElement);
    });

    imagesContainer.style.display = "block";
  } catch (error) {
    console.error(`Error fetching ${stock} images:`, error.message);

    imagesContainer.textContent = `Failed to fetch ${stock} images. Please try again later.`;
  }
}
