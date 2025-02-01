document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    if (!city) {
      alert("Please enter a city name");
      return;
    }
  
    fetch(`/labs?city=${encodeURIComponent(city)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch labs");
        }
        return response.json();
      })
      .then(labs => {
        const labList = document.getElementById("labList");
        labList.innerHTML = ""; // Clear previous results
  
        if (labs.length === 0) {
          labList.innerHTML = "<p>No labs found for the entered city.</p>";
          return;
        }
  
        labs.forEach(lab => {
          const labItem = document.createElement("div");
          labItem.innerHTML = `
            <h3>${lab.name}</h3>
            <p><strong>Location:</strong> ${lab.location}</p>
            <p><strong>Distance:</strong> ${lab.distance} km</p>
            <button onclick="showDetails(${lab.id})">More Info</button>
          `;
          labList.appendChild(labItem);
        });
      })
      .catch(error => {
        console.error("Error fetching labs:", error);
        alert("Error fetching labs.");
      });
  });
  