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

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

function addRecord() {
    const animalName = document.getElementById("animalName").value;
    const recordDate = document.getElementById("recordDate").value;
    const details = document.getElementById("details").value;

    if (animalName && recordDate && details) {
        alert("Record added successfully!");

        // Send Email Notification
        sendEmailNotification("Birth/Death Entry", animalName, recordDate, details);

        document.getElementById("birthDeathForm").reset();
    } else {
        alert("Please fill out all fields.");
    }
}

function addFeed() {
    const feedType = document.getElementById("feedType").value;
    const feedQuantity = document.getElementById("feedQuantity").value;
    const feedDate = document.getElementById("feedDate").value;

    if (feedType && feedQuantity && feedDate) {
        alert("Feed record added successfully!");

        // Send Email Notification
        sendEmailNotification("Feed Management", feedType, feedDate, `Quantity: ${feedQuantity} kg`);

        document.getElementById("feedForm").reset();
    } else {
        alert("Please fill out all fields.");
    }
}

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
