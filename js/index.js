document.addEventListener('DOMContentLoaded', () => {
  const timeInput = document.getElementById('timeInput');  // Use datetime-local input
  const checkTempButton = document.getElementById('checkTempButton');
  const resultsContent = document.getElementById('resultsContent');
  const resultsText = document.getElementById('resultsText');

  // Fetch weather data from Open-Meteo API
  fetch('https://api.open-meteo.com/v1/forecast?latitude=49.6992&longitude=-123.1563&hourly=temperature_2m&timezone=America%2FNew_York&past_days=2&forecast_days=3', {
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
      // Event listener for the "Check Temperature" button
      checkTempButton.addEventListener('click', () => {
          const inputDateTime = timeInput.value;  // Get the datetime-local value
          const userDateTime = luxon.DateTime.fromISO(inputDateTime);  // User's local time
          const nyDateTime = userDateTime.setZone('America/New_York');  // Convert to New York timezone
          
          resultsContent.innerHTML = '';  // Clear previous results

          if (!nyDateTime.isValid) {  // Validate input date and time
              resultsText.textContent = 'Please enter a valid date and time.';
              return;
          }

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
              const formattedDateTime = nyDateTime.toLocaleString(luxon.DateTime.DATETIME_MED_WITH_WEEKDAY); // Example: Monday, Sep 24, 2023, 3:00 PM
              
              const tempDiv = document.createElement('div');
              tempDiv.textContent = `The temperature on ${formattedDateTime} is ${matchedTemperature.toFixed(1)}°C`;
              resultsContent.appendChild(tempDiv);
              resultsText.textContent = 'Temperature fetched successfully!';
          } else {
              resultsText.textContent = 'No temperatures found for the given time and day.';
          }
      });
  })
  .catch(error => {
      console.error('Error:', error);
      resultsText.textContent = 'Error fetching data. Please try again later.';
  });
});
