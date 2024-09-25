document.addEventListener('DOMContentLoaded', () => {
  const timeInput = document.getElementById('timeInput');
  const dayInput = document.getElementById('dayInput');
  const checkTempButton = document.getElementById('checkTempButton');
  const resultsContent = document.getElementById('resultsContent');
  const resultsText = document.getElementById('resultsText');

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
    checkTempButton.addEventListener('click', () => {
      const inputTime = timeInput.value;
      const inputDay = dayInput.value;

      // Filter and display data according to the API documentation
      const filteredTemperatures = data.hourly.time
        .map((time, index) => ({ time, temperature: data.hourly.temperature_2m[index] }))
        .filter(entry => {
          const entryDate = new Date(entry.time);
          const inputDate = new Date(inputDay);
          inputDate.setHours(parseInt(inputTime.split(':')[0]));
          inputDate.setMinutes(parseInt(inputTime.split(':')[1]));
          return entryDate.getHours() === inputDate.getHours() &&
                 entryDate.getMinutes() === inputDate.getMinutes() &&
                 entryDate.toDateString() === inputDate.toDateString();
        });

      if (filteredTemperatures.length > 0) {
        filteredTemperatures.forEach(entry => {
          const tempDiv = document.createElement('div');
          tempDiv.textContent = `Time: ${entry.time}, Temperature: ${entry.temperature}°F`;
          resultsContent.appendChild(tempDiv);
        });
        resultsText.textContent = 'Temperatures fetched successfully!';
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
