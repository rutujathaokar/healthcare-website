// If you want to handle form submissions or other interactive actions on the front-end,
// you can add the following script here. In this example, the form will not refresh the page
// on submission, and it will display an alert when a search is made.

document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission dynamically
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent form from reloading the page
      const location = document.querySelector('input[name="location"]').value;
  
      if (location) {
        // You can modify this to show search results dynamically, or send the input to the server
        alert(`Searching for clinics near: ${location}`);
      } else {
        alert("Please enter a location to search for clinics.");
      }
    });
  });
  