document.addEventListener('DOMContentLoaded', () => {
    const timeInput = document.getElementById('timeInput');  // Use datetime-local input
    const checkTempButton = document.getElementById('checkTempButton');
    const resultsContent = document.getElementById('resultsContent');
    const resultsText = document.getElementById('resultsText');
    const citySelector = document.getElementById('citySelector');
  
    // Event listener for the "Check Temperature" button
    checkTempButton.addEventListener('click', () => {
        const selectedCity = citySelector.value; // Get the selected location (lat, lon)
        const [latitude, longitude] = selectedCity.split(','); // Split into latitude and longitude
        const inputDateTime = timeInput.value;  // Get the datetime-local value
        const userDateTime = luxon.DateTime.fromISO(inputDateTime);  // User's local time
        const nyDateTime = userDateTime.setZone('America/New_York');  // Convert to New York timezone
        
        resultsContent.innerHTML = '';  // Clear previous results
  
        if (!nyDateTime.isValid) {  // Validate input date and time
            resultsText.textContent = 'Please enter a valid date and time.';
            return;
        }
  
        // Fetch weather data from Open-Meteo API using the selected city coordinates
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=America/New_York&past_days=2&forecast_days=3`, {
            mode: 'cors'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch weather data');
            }
        })
        .then(data => {
            // Access the hourly time and temperature data from the API
            const apiTimes = data.hourly.time;  // Array of times from API
            const apiTemps = data.hourly.temperature_2m;  // Array of temperatures from API
            
            // Find the closest matching temperature for the selected time
            let matchedTemperature = null;
            apiTimes.forEach((apiTime, index) => {
                const apiDateTime = luxon.DateTime.fromISO(apiTime, { zone: 'America/New_York' });
  
                // Check if the API time matches the user input time at the hour level
                if (apiDateTime.hasSame(nyDateTime, 'hour')) {
                    matchedTemperature = apiTemps[index];
                }
            });

            // Display the result if a match was found
            if (matchedTemperature !== null) {
                // Format the date and time to a readable format
                const formattedDateTime = nyDateTime.toLocaleString(luxon.DateTime.DATETIME_MED_WITH_WEEKDAY); 
                
                const tempDiv = document.createElement('div');
                const selectedCityLabel = citySelector.options[citySelector.selectedIndex].text;
                tempDiv.textContent = `The temperature on ${formattedDateTime} in ${selectedCityLabel} is ${matchedTemperature.toFixed(1)}°C`;
                resultsContent.appendChild(tempDiv);
                resultsText.textContent = 'Dress accordingly!';
            } else {
                resultsText.textContent = 'No temperatures found for the given time and day.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultsText.textContent = 'Error fetching data. Please try again later.';
        });
    });
  
    // Convert Celsius to Fahrenheit
    function convertToFahrenheit() {
        const celsiusInput = document.getElementById('celsiusInput');
        const result = document.getElementById('result');
        const celsiusValue = parseFloat(celsiusInput.value);
      
        if (!isNaN(celsiusValue)) {
          const fahrenheitValue = (celsiusValue * 9/5) + 32;
          result.textContent = `Temperature in Fahrenheit: ${fahrenheitValue.toFixed(2)}°F`;
        } else {
          result.textContent = 'Please enter a valid number.';
        }
      }
      
      // Add event listener for the conversion button
      const convertButton = document.getElementById('convertButton');
      convertButton.addEventListener('click', convertToFahrenheit);
  });
  