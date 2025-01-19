// Mock JSON data for requirements and available feeds
const requirements = [
  { "Live Weight (Kgs)": 400, "Net Energy (Mcal)": 7.16, "Crude Protein (gms)": 318 },
  { "Live Weight (Kgs)": 425, "Net Energy (Mcal)": 7.31, "Crude Protein (gms)": 329.5 },
  // Add more requirements as needed
];

const availableFeeds = [
  { "Feed Stuff": "Barley", "Crude Protein (%)": 8.92, "Dry Matter (%)": 91.4 },
  { "Feed Stuff": "Soybean", "Crude Protein (%)": 48.0, "Dry Matter (%)": 94.4 },
  // Add more feeds as needed
];

document.getElementById('feedForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById('weight').value);
  const activity = document.getElementById('activity').value;

  // Find the closest weight requirement
  const requirement = requirements.reduce((prev, curr) => {
    return Math.abs(curr["Live Weight (Kgs)"] - weight) < Math.abs(prev["Live Weight (Kgs)"] - weight) ? curr : prev;
  });

  const proteinRequirement = requirement["Crude Protein (gms)"];
  const energyRequirement = requirement["Net Energy (Mcal)"];

  // Calculate feed plan based on available feeds
  const feedPlan = availableFeeds.map(feed => {
    const proteinContribution = (feed["Crude Protein (%)"] / 100) * feed["Dry Matter (%)"];
    const amountNeeded = proteinRequirement / proteinContribution;
    return {
      feed: feed["Feed Stuff"],
      amount: amountNeeded.toFixed(2) + ' kg'
    };
  });

  // Update the results
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('protein').innerText = `Protein Requirement: ${proteinRequirement} g`;
  document.getElementById('energy').innerText = `Energy Requirement: ${energyRequirement} Mcal`;

  const feedPlanList = document.getElementById('feedPlan');
  feedPlanList.innerHTML = '';
  feedPlan.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.feed}: ${item.amount}`;
    feedPlanList.appendChild(listItem);
  });
});
