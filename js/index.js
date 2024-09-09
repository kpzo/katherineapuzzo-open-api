fetch(`https://www.artic.edu/artworks/27992`)
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Failed to fetch artwork');
    }
  })
  .catch(error => {
    if (error instanceof SyntaxError) {
      console.log('Unparsable response from server');
    } else {
    console.log('Error fetching data:', error);
    }
  });