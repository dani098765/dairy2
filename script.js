// Initialize EmailJS (replace YOUR_PUBLIC_KEY with your actual EmailJS public key)
emailjs.init("ftHMBZfK0Pum-8GGK");

// Dummy User Data
const users = {
    "vetdoctor": { password: "123", role: "Vet Doctor", permissions: ["all"] },
    "farmowner": { password: "123", role: "Farm Owner", permissions: ["all"] },
    "farmmanager": { password: "123", role: "Farm Manager", permissions: ["birthDeath", "feedManagement"] },
};

// Current logged-in user
let currentUser = null;

// All records data
const records = [];

// Login Functionality
function login() {
    const username = document.getElementById("loginUsername").value.toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("userRole").textContent = currentUser.role;

        configureDashboard(currentUser.permissions);
    } else {
        alert("Invalid username or password.");
    }
}

// Configure Dashboard Based on Permissions
function configureDashboard(permissions) {
    const tabs = {
        birthDeathTab: "birthDeath",
        feedManagementTab: "feedManagement",
        feedFormulationTab: "all",
        recordsTab: "all",
        economicsTab: "all",
    };

    for (let tabId in tabs) {
        const tab = document.getElementById(tabId);
        if (permissions.includes("all") || permissions.includes(tabs[tabId])) {
            tab.classList.remove("hidden");
        } else {
            tab.classList.add("hidden");
        }
    }
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Add Record
function addRecord(type) {
    let recordDetails = {};
    const currentDate = new Date().toISOString().split("T")[0];

    if (type === "birthDeath") {
        const motherName = document.getElementById("motherName").value;
        const babyName = document.getElementById("babyName").value;
        const gender = document.getElementById("gender").value;
        const recordDate = document.getElementById("recordDate").value || currentDate;
        const details = document.getElementById("details").value;
        const imageFile = document.getElementById("imageUpload").files[0]?.name || "No image uploaded";

        if (motherName && babyName && gender && details) {
            recordDetails = {
                date: recordDate,
                type: "Birth/Death",
                description: `Mother: ${motherName}, Baby: ${babyName}, Gender: ${gender}, Details: ${details}, Image: ${imageFile}`,
            };
            sendEmailNotification("Birth/Death Entry", babyName, recordDate, `Mother: ${motherName}, Gender: ${gender}, Details: ${details}, Image: ${imageFile}`);
        } else {
            alert("Please fill out all fields for Birth/Death Entry.");
            return;
        }
    } else if (type === "feedManagement") {
        const feedType = document.getElementById("feedType").value;
        const quantity = document.getElementById("feedQuantity").value;
        const feedDate = document.getElementById("feedDate").value || currentDate;

        if (feedType && quantity) {
            recordDetails = {
                date: feedDate,
                type: "Feed Management",
                description: `Feed Type: ${feedType}, Quantity: ${quantity} kg`,
            };
            sendEmailNotification("Feed Management", feedType, feedDate, `Quantity: ${quantity} kg`);
        } else {
            alert("Please fill out all fields for Feed Management.");
            return;
        }
    }

    records.push(recordDetails);
    updateRecordsTable();
    alert("Record added successfully!");
    resetForm(type);
}

// Update Records Table
function updateRecordsTable() {
    const tableBody = document.querySelector("#recordsTable tbody");
    tableBody.innerHTML = "";

    records.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((record) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.type}</td>
            <td>${record.description}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Reset Form
function resetForm(type) {
    if (type === "birthDeath") {
        document.getElementById("birthDeathForm").reset();
    } else if (type === "feedManagement") {
        document.getElementById("feedForm").reset();
    }
}

// Add Economics Record
function addEconomicsRecord() {
    const econType = document.getElementById("expenseType").value;
    const amount = document.getElementById("amount").value;
    const econDate = document.getElementById("econDate").value;

    if (econType && amount && econDate) {
        const record = {
            date: econDate,
            type: "Economics",
            description: `${econType}: $${amount}`,
        };

        records.push(record);
        updateRecordsTable();
        alert("Economics record added successfully!");
        document.getElementById("economicsForm").reset();
    } else {
        alert("Please fill out all fields for Economics.");
    }
}

// Send Email Notification
function sendEmailNotification(recordType, recordName, recordDate, details) {
    const templateParams = {
        to_email: "danialvis0987@yahoo.com",
        record_type: recordType,
        record_name: recordName,
        record_date: recordDate,
        details: details,
    };

    emailjs
        .send("service_s81t1xq", "template_ub4i2qm", templateParams) // Replace with your Service ID and Template ID
        .then(() => {
            console.log("Email sent successfully!");
        })
        .catch((error) => {
            console.error("Error sending email:", error);
        });
}

function filterRecords() {
    const filterValue = document.getElementById("recordTypeFilter").value;
    const tableRows = document.querySelectorAll("#recordsTable tbody tr");

    tableRows.forEach(row => {
        const type = row.getAttribute("data-type");
        row.style.display = (filterValue === "all" || type === filterValue) ? "" : "none";
    });
}
