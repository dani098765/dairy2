// Mock data for feed ingredients (simplified for testing)
const feeds = [
  { name: "Barley", energy: 1.86, protein: 8.92, calcium: 0.06, phosphorus: 0.39 },
  { name: "Soybean", energy: 1.80, protein: 48.0, calcium: 0.20, phosphorus: 0.40 },
  { name: "Maize", energy: 1.96, protein: 9.8, calcium: 0.04, phosphorus: 0.3 },
  { name: "Wheat", energy: 1.95, protein: 11.0, calcium: 0.05, phosphorus: 0.35 }
];

// Populate the feed selection dropdown
const feedSelect = document.getElementById("feedSelect");
feeds.forEach(feed => {
  const option = document.createElement("option");
  option.value = feed.name;
  option.textContent = feed.name;
  feedSelect.appendChild(option);
});

// Handle feed selection and price input generation
feedSelect.addEventListener("change", () => {
  const selectedOptions = Array.from(feedSelect.selectedOptions).map(option => option.value);
  const selectedFeedsDiv = document.getElementById("selectedFeeds");
  selectedFeedsDiv.innerHTML = ""; // Clear previous selections

  selectedOptions.forEach(feedName => {
    const feedInputDiv = document.createElement("div");
    feedInputDiv.innerHTML = `
      <label>
        ${feedName} Price ($/kg):
        <input type="number" data-feed="${feedName}" class="feedPrice" required>
      </label>`;
    selectedFeedsDiv.appendChild(feedInputDiv);
  });
});

// Handle form submission
document.getElementById("feedForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Gather user inputs
  const weight = parseFloat(document.getElementById("weight").value);
  const milkYield = parseFloat(document.getElementById("milkYield").value);
  const fatPercentage = parseFloat(document.getElementById("fatPercentage").value);

  if (isNaN(weight) || isNaN(milkYield) || isNaN(fatPercentage)) {
    alert("Please enter valid animal details.");
    return;
  }

  // Nutritional requirements calculation
  const netEnergyRequirement = (weight * 0.07) + (milkYield * (0.4 + 0.15 * fatPercentage));
  const proteinRequirement = (weight * 1.2) + (milkYield * (12 + fatPercentage * 2));

  // Fetch feed prices
  const feedPrices = {};
  document.querySelectorAll(".feedPrice").forEach(input => {
    const feedName = input.dataset.feed;
    const price = parseFloat(input.value);
    if (!isNaN(price)) {
      feedPrices[feedName] = price;
    }
  });

  if (Object.keys(feedPrices).length === 0) {
    alert("Please select feeds and enter their prices.");
    return;
  }

  // Filter selected feeds
  const selectedFeeds = feeds.filter(feed => Object.keys(feedPrices).includes(feed.name));

  // Optimize feed formulation
  const feedPlan = [];
  let totalCost = 0;

  selectedFeeds.forEach(feed => {
    const proteinContribution = feed.protein;
    const inclusionRate = proteinRequirement / proteinContribution;
    const cost = inclusionRate * feedPrices[feed.name];

    feedPlan.push({ name: feed.name, amount: inclusionRate.toFixed(2), cost: cost.toFixed(2) });
    totalCost += cost;
  });

  // Display results
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("totalCost").innerText = `Total Cost: $${totalCost.toFixed(2)}`;

  const feedPlanList = document.getElementById("feedPlan");
  feedPlanList.innerHTML = "";
  feedPlan.forEach(feed => {
    const listItem = document.createElement("li");
    listItem.textContent = `${feed.name}: ${feed.amount} kg ($${feed.cost})`;
    feedPlanList.appendChild(listItem);
  });
});
