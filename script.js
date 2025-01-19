// Initialize EmailJS (replace YOUR_PUBLIC_KEY with your actual public key)
emailjs.init("ftHMBZfK0Pum-8GGK");

// Users and Roles
const users = {
    admin: { role: "Admin", password: "12345" },
    vetdoctor: { role: "Vet Doctor", password: "12345" },
    farmowner: { role: "Farm Owner", password: "12345" },
};

// Login
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username].password === password) {
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("user-role").textContent = users[username].role;
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
});

// Show Tabs
function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.add("hidden"));
    document.getElementById(tabId).classList.remove("hidden");
}

// Send Email Notification
function sendEmailNotification(subject, message) {
    const templateParams = {
        subject: subject,
        message: message,
        to_email: "example@example.com", // Replace with the recipient's email
    };

    emailjs
        .send("service_s81t1xq", "template_ub4i2qm", templateParams)
        .then(() => {
            console.log("Email sent successfully!");
        })
        .catch((error) => {
            console.error("Error sending email:", error);
        });
}

// Add Animal Record
document.getElementById("animal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const animalName = document.getElementById("animal-name").value;
    const animalType = document.getElementById("animal-type").value;
    const birthDate = document.getElementById("birth-date").value;

    const message = `Animal Record Added:\nName: ${animalName}\nType: ${animalType}\nBirth Date: ${birthDate}`;
    sendEmailNotification("New Animal Record", message);

    alert("Animal record added successfully and email notification sent!");
    e.target.reset();
});

// Add Feed Record
document.getElementById("feed-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const feedType = document.getElementById("feed-type").value;
    const quantity = document.getElementById("quantity").value;
    const date = document.getElementById("feed-date").value;

    const message = `Feed Record Added:\nFeed Type: ${feedType}\nQuantity: ${quantity} kg\nDate: ${date}`;
    sendEmailNotification("New Feed Record", message);

    alert("Feed record added successfully and email notification sent!");
    e.target.reset();
});

// Economics Calculation
document.getElementById("economics-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const expenditure = parseFloat(document.getElementById("expenditure").value);
    const milkProduction = parseFloat(document.getElementById("milk-production").value);
    const milkPrice = parseFloat(document.getElementById("milk-price").value);

    const income = milkProduction * milkPrice;
    const profit = income - expenditure;

    const message = `Economics Record:\nExpenditure: PKR ${expenditure}\nIncome: PKR ${income}\nProfit: PKR ${profit}`;
    sendEmailNotification("Economics Update", message);

    document.getElementById("profit-summary").textContent = `Profit: PKR ${profit.toFixed(2)}`;
    alert("Economics calculated successfully and email notification sent!");
    e.target.reset();
});

// Feed Formulation Example
document.getElementById("formulation-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById("animal-weight").value);
    const milk = parseFloat(document.getElementById("milk-quantity").value);

    const feeds = [
        { name: "Corn", price: 50 },
        { name: "Soybean Meal", price: 100 },
        { name: "Wheat Bran", price: 30 },
    ];

    let results = "";
    let totalCost = 0;

    feeds.forEach((feed) => {
        const required = (weight + milk) / feeds.length;
        const cost = required * feed.price;
        totalCost += cost;
        results += `${feed.name}: ${required.toFixed(2)}kg (Cost: PKR ${cost.toFixed(2)})<br>`;
    });

    const message = `Feed Formulation:\nAnimal Weight: ${weight}\nMilk Requirement: ${milk}\nTotal Cost: PKR ${totalCost}`;
    sendEmailNotification("Feed Formulation Suggestion", message);

    document.getElementById("feed-results").innerHTML = results;
    alert("Feed formulation calculated and email notification sent!");
});
