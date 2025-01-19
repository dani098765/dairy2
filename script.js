// JavaScript for Feed Calculation Web App

const feedOptions = [
    { name: "Corn", unitPrice: 50, maxInclusion: 30 },
    { name: "Soybean Meal", unitPrice: 90, maxInclusion: 20 },
    { name: "Wheat Bran", unitPrice: 40, maxInclusion: 25 },
    { name: "Rice Bran", unitPrice: 35, maxInclusion: 25 },
    { name: "Cottonseed Meal", unitPrice: 70, maxInclusion: 15 }
    // Add more feed options as needed
];

function populateFeedSelection() {
    const feedSelection = document.getElementById("feed-selection");

    feedOptions.forEach(feed => {
        const option = document.createElement("option");
        option.value = feed.name;
        option.textContent = `${feed.name} (PKR ${feed.unitPrice}/kg, Max: ${feed.maxInclusion}%)`;
        feedSelection.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    populateFeedSelection();

    const feedForm = document.getElementById("formulation-form");

    feedForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const animalWeight = parseFloat(document.getElementById("animal-weight").value);
        const milkQuantity = parseFloat(document.getElementById("milk-quantity").value);
        const fatPercentage = parseFloat(document.getElementById("fat-percentage").value);

        if (isNaN(animalWeight) || isNaN(milkQuantity) || isNaN(fatPercentage)) {
            alert("Please provide valid numeric values for all fields.");
            return;
        }

        const totalFeedRequirement = (animalWeight * 0.025) + (milkQuantity * 0.4);

        const results = feedOptions.map(feed => {
            const inclusionKg = (totalFeedRequirement * feed.maxInclusion) / 100;
            const cost = inclusionKg * feed.unitPrice;
            return {
                name: feed.name,
                inclusionKg: inclusionKg.toFixed(2),
                cost: cost.toFixed(2)
            };
        });

        displayFormulationResults(results, totalFeedRequirement);
    });
});

function displayFormulationResults(results, totalFeedRequirement) {
    const resultsDiv = document.getElementById("formulation-results");
    resultsDiv.innerHTML = "";

    const table = document.createElement("table");

    const headerRow = document.createElement("tr");
    ["Feed Name", "Inclusion (kg)", "Cost (PKR)"].forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    results.forEach(result => {
        const row = document.createElement("tr");

        Object.values(result).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        table.appendChild(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>${totalFeedRequirement.toFixed(2)} kg</strong></td>
        <td></td>
    `;
    table.appendChild(totalRow);

    resultsDiv.appendChild(table);
}
