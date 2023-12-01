// Define the OpenWeatherMap API key
const apiKey = "3372fe48b039eca06a50ce92008cd02c";

// Define the URL for fetching country data
const countryUrl = "https://restcountries.com/v2/all";

// Function to fetch weather data for a specific country
const fetchWeatherData = async (latitude, longitude, countryName, flagUrl) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  const response = await fetch(weatherUrl);
  const weatherData = await response.json();
  return {
    countryName,
    flagUrl,
    weatherData,
  };
};

// Fetch country data using the Fetch API and handle the response
fetch(countryUrl)
  .then((response) => response.json())
  .then((countries) => {
    // Get the container where country information will be displayed
    const container = document.getElementById("countries-container");

    // Iterate through each country in the response
    countries.forEach((country) => {
      const countryDiv = document.createElement("div");
      countryDiv.classList.add(
        "country-card",
        "col-sm-6",
        "col-md-4",
        "col-lg-4",
        "col-xl-4"
      );

      const countryName = country.name || "N/A";
      const latitude = country.latlng[0] || 0;
      const longitude = country.latlng[1] || 0;
      const flagUrl = findFlagUrl(country); // Add function to find flag URL

      // Append country name and flag to the country card
      countryDiv.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">${countryName}</h5>
          </div>
          <img class="card-img-top" src="${flagUrl}" alt="${countryName} Flag"> <!-- Add flag image -->
          <div class="card-text weather-info" id="${countryName.replace(
            /\s/g,
            "-"
          )}">Loading Weather...</div>
        </div>
      `;

      // Append the country card to the container
      container.appendChild(countryDiv);

      // Fetch weather data for the current country and update the card with the information
      fetchWeatherData(latitude, longitude, countryName, flagUrl)
        .then(({ countryName, flagUrl, weatherData }) => {
          const weatherInfoDiv = document.getElementById(
            `${countryName.replace(/\s/g, "-")}`
          );
          weatherInfoDiv.innerHTML = `
            Temperature: ${weatherData.main.temp} K<br>
            Min Temperature: ${weatherData.main.temp_min} K<br>
            Max Temperature: ${weatherData.main.temp_max} K<br>
            Humidity: ${weatherData.main.humidity}%<br>
            Pressure: ${weatherData.main.pressure} hPa<br>
            Sea Level: ${weatherData.main.sea_level || "N/A"}<br>
            Ground Level: ${weatherData.main.grnd_level || "N/A"}<br>
            Description: ${weatherData.weather[0].description}<br>
          `;
        })
        .catch((error) => {
          console.error(
            `Error fetching weather data for ${countryName}:`,
            error
          );
        });
    });
  })
  .catch((error) => {
    console.error("Error fetching country data:", error);
  });

// Function to find the flag URL in the country object
function findFlagUrl(country) {
  for (const key in country) {
    if (
      country.hasOwnProperty(key) &&
      typeof country[key] === "string" &&
      country[key].startsWith("http")
    ) {
      return country[key];
    }
  }
  return "N/A";
}
