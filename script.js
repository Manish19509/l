// Request notification permission on initial load
if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            startHourlyNotifications();
        } else {
            alert("Enable notifications for hourly reminders.");
        }
    });
} else if (Notification.permission === "granted") {
    startHourlyNotifications();
} else {
    alert("Notification permission denied. Please enable it in browser settings.");
}

// Function to start hourly notifications
function startHourlyNotifications() {
    setInterval(() => {
        sendHourlyNotification();
    }, 60 * 60 * 1000); // every hour
}

// Send a notification
function sendHourlyNotification() {
    if (Notification.permission === "granted") {
        new Notification("Hourly Activity Tracker", {
            body: "What did you do in the last hour? Log it now!",
            icon: "https://img.icons8.com/ios-filled/50/000000/clock.png"
        });
    }
}

// Elements
const form = document.getElementById("activity-form");
const activityInput = document.getElementById("activity-input");
const timeInput = document.getElementById("time-input");
const activityLog = document.getElementById("activity-log");

// Load existing activities from localStorage
function loadActivities() {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.forEach(activity => addActivityToDOM(activity));
}

// Save activity in localStorage
function saveActivity(activity) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activity);
    localStorage.setItem("activities", JSON.stringify(activities));
}

// Add activity to the DOM
function addActivityToDOM(activity) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${activity.description}</strong> 
        <span>@ ${new Date(activity.time).toLocaleString()}</span>
        <button class="remove-btn" onclick="removeActivity('${activity.time}')">Remove</button>
    `;
    activityLog.appendChild(li);
}

// Handle form submission
form.addEventListener("submit", event => {
    event.preventDefault();
    
    const activityDescription = activityInput.value.trim();
    const activityTime = timeInput.value;

    if (activityDescription && activityTime) {
        const activity = {
            description: activityDescription,
            time: activityTime
        };
        addActivityToDOM(activity);
        saveActivity(activity);
        
        // Clear input fields
        activityInput.value = "";
        timeInput.value = "";
    }
});

// Remove activity from DOM and localStorage
function removeActivity(time) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities = activities.filter(activity => activity.time !== time);
    localStorage.setItem("activities", JSON.stringify(activities));
    
    // Re-render the activity log
    activityLog.innerHTML = "";
    loadActivities();
}

// Initial load
loadActivities();
