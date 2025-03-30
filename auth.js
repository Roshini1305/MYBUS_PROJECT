async function loginUser(event) {
    event.preventDefault(); // Prevent form from reloading the page

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Please fill in both fields!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem("loggedInUser", "true");

            console.log("User Data:", data);
            // Redirect to a dashboard or another page if needed
            window.location.href = "index.html";
        } else {
            alert(data.message); // Show error message from server
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
    }
}

// Function to handle signup
function registerUser(event) {
    event.preventDefault();

    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    // Store user details in localStorage
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    alert("Signup Successful! Redirecting to login...");
    window.location.href = "login.html"; // Redirect to login page
}

window.onload = function () {
    let isLoggedIn = localStorage.getItem("loggedInUser"); // Assume you store a logged-in user

    if (isLoggedIn) {
        document.getElementById("authButtons").style.display = "none"; // Hide Login & Signup
        document.getElementById("profileIcon").style.display = "block"; // Show Profile Icon
    }
};

