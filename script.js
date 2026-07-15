/* ============================================================
   ReWear - script.js
   PART 1 - LOGIN SYSTEM
============================================================ */

const loginForm = document.getElementById("login");

if (loginForm) {

    loginForm.addEventListener("submit", loginUser);

}

/* ============================================================
   LOGIN FUNCTION
============================================================ */

async function loginUser(e) {

    e.preventDefault();

    /* -------------------------
       Elements
    ------------------------- */

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const msg = document.getElementById("msg");

    const submitBtn = loginForm.querySelector("button[type='submit']");



    /* -------------------------
       Reset Previous Errors
    ------------------------- */

    emailError.textContent = "";

    passwordError.textContent = "";

    hideMessage(msg);



    /* -------------------------
       Validation
    ------------------------- */

    let valid = true;

    if (email.value.trim() === "") {

        emailError.textContent = "Please enter your Email.";

        valid = false;

    }

    if (password.value.trim() === "") {

        passwordError.textContent = "Please enter your Password.";

        valid = false;

    }

    if (!valid) return;



    /* -------------------------
       Loading Button
    ------------------------- */

    submitBtn.disabled = true;

    submitBtn.innerHTML = `

        <i class="fas fa-spinner fa-spin"></i>

        Logging in...

    `;



    try {

        /* -------------------------
           Backend Request
        ------------------------- */

        const response = await fetch(

            `${API_BASE}/auth/login`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email.value.trim(),

                    password: password.value

                })

            }

        );



        const data = await response.json();



        /* -------------------------
           Login Failed
        ------------------------- */

        if (!response.ok) {

            showMessage(

                msg,

                data.message || "Invalid Email or Password.",

                "error"

            );

            submitBtn.disabled = false;

            submitBtn.innerHTML = "Login";

            return;

        }



        /* -------------------------
           Save User
        ------------------------- */

        localStorage.setItem(
    "rewear_token",
    data.token
);

localStorage.setItem(
    "rewear_user",
    JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        points: data.points,
        role: data.role
    })
);



        /* -------------------------
           Success Message
        ------------------------- */

        showMessage(

            msg,

            "Login Successful!",

            "success"

        );



        /* -------------------------
           Close Modal
        ------------------------- */

        setTimeout(() => {

            loginForm.reset();

            hideMessage(msg);

            closeModal();

            updateNavbar();

        }, 1500);

    }

    catch (error) {

        console.error(error);

        showMessage(

            msg,

            "Unable to connect to server.",

            "error"

        );

    }

    finally {

        submitBtn.disabled = false;

        submitBtn.innerHTML = "Login";

    }

}



/* ============================================================
   AUTO LOGIN CHECK
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    if (isLoggedIn()) {

        updateNavbar();

    }

});
/* ============================================================
   PART 2 - REGISTER SYSTEM
============================================================ */

const registerForm = document.getElementById("register");

if (registerForm) {

    registerForm.addEventListener("submit", registerUser);

}


/* ============================================================
   REGISTER USER
============================================================ */

async function registerUser(e) {

    e.preventDefault();

    /* -------------------------
       Input Fields
    ------------------------- */

    const fullname = document.getElementById("fullname");

    const email = document.getElementById("reg-email");

    const password = document.getElementById("reg-pass");

    const confirm = document.getElementById("confirm");


    /* -------------------------
       Error Fields
    ------------------------- */

    const fullnameError = document.getElementById("fullname_error");

    const emailError = document.getElementById("email_error");

    const passwordError = document.getElementById("password_error");

    const confirmError = document.getElementById("confirm_error");

    const message = document.getElementById("message");

    const submitBtn = registerForm.querySelector("button[type='submit']");


    /* -------------------------
       Reset Errors
    ------------------------- */

    fullnameError.textContent = "";

    emailError.textContent = "";

    passwordError.textContent = "";

    confirmError.textContent = "";

    hideMessage(message);


    let valid = true;


    /* -------------------------
       Full Name Validation
    ------------------------- */

    if (fullname.value.trim() === "") {

        fullnameError.textContent = "Please enter your full name.";

        valid = false;

    }

    else if (fullname.value.trim().length < 3) {

        fullnameError.textContent = "Name must contain at least 3 characters.";

        valid = false;

    }


    /* -------------------------
       Email Validation
    ------------------------- */

    const emailRegex =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {

        emailError.textContent = "Please enter your email.";

        valid = false;

    }

    else if (!emailRegex.test(email.value.trim())) {

        emailError.textContent = "Please enter a valid email.";

        valid = false;

    }


    /* -------------------------
       Password Validation
    ------------------------- */

    if (password.value.length < 6) {

        passwordError.textContent =

            "Password must be at least 6 characters.";

        valid = false;

    }


    /* -------------------------
       Confirm Password
    ------------------------- */

    if (confirm.value !== password.value) {

        confirmError.textContent =

            "Passwords do not match.";

        valid = false;

    }


    if (!valid) return;


    /* -------------------------
       Loading
    ------------------------- */

    submitBtn.disabled = true;

    submitBtn.innerHTML = `

        <i class="fas fa-spinner fa-spin"></i>

        Creating Account...

    `;


    try {

        /* -------------------------
           API Request
        ------------------------- */

        const response = await fetch(

            `${API_BASE}/auth/register`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name: fullname.value.trim(),

                    email: email.value.trim(),

                    password: password.value

                })

            }

        );


        const data = await response.json();


        /* -------------------------
           Register Failed
        ------------------------- */

        if (!response.ok) {

            showMessage(

                message,

                data.message ||

                "Registration failed.",

                "error"

            );

            submitBtn.disabled = false;

            submitBtn.innerHTML = "Register";

            return;

        }


        /* -------------------------
           Success
        ------------------------- */

        showMessage(

            message,

            "Registration Successful!",

            "success"

        );


        registerForm.reset();


        /* -------------------------
           Open Login Modal
        ------------------------- */

        setTimeout(() => {

            closeRegister();

            hideMessage(message);

            openModal();

        }, 1800);

    }

    catch (error) {

        console.error(error);

        showMessage(

            message,

            "Unable to connect to server.",

            "error"

        );

    }

    finally {

        submitBtn.disabled = false;

        submitBtn.innerHTML = "Register";

    }

}


/* ============================================================
   CLEAR ERRORS WHILE TYPING
============================================================ */

const registerInputs = [

    "fullname",

    "reg-email",

    "reg-pass",

    "confirm"

];

registerInputs.forEach(id => {

    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", () => {

        switch(id){

            case "fullname":

                document.getElementById("fullname_error").textContent="";

                break;

            case "reg-email":

                document.getElementById("email_error").textContent="";

                break;

            case "reg-pass":

                document.getElementById("password_error").textContent="";

                break;

            case "confirm":

                document.getElementById("confirm_error").textContent="";

                break;

        }

    });

});
/* ============================================================
   PART 3 - AUTH STATE, NAVBAR & APP INITIALIZATION
============================================================ */


/* ============================
   Check Authentication
============================ */

function checkAuthentication() {

    const token = getToken();

    const user = getCurrentUser();

    if (!token || !user) {

        updateNavbar();

        return false;

    }

    updateNavbar();

    return true;

}


/* ============================
   Protected Pages
============================ */

function requireLogin() {

    if (!isLoggedIn()) {

        openModal();

        return false;

    }

    return true;

}


/* ============================
   Logout
============================ */



/* ============================
   Navbar Button Events
============================ */

function initializeNavbar() {

    const loginBtn = document.querySelector(".login-btn");

    const registerBtn = document.querySelector(".register-btn");

    if (!loginBtn || !registerBtn) return;


    if (isLoggedIn()) {

        const user = getCurrentUser();

        loginBtn.textContent =

            user?.name || "Profile";

        loginBtn.onclick = () => {

            window.location.href =

                "profile.html";

        };


        registerBtn.textContent = "Logout";

        registerBtn.onclick = logoutUser;

    }

    else {

        loginBtn.textContent = "Login";

        loginBtn.onclick = openModal;

        registerBtn.textContent = "Register";

        registerBtn.onclick = openRegister;

    }

}


/* ============================
   Auto Close Alerts
============================ */

function autoHideAlerts() {

    const msg = document.getElementById("msg");

    const registerMsg = document.getElementById("message");

    if (msg && msg.style.display === "block") {

        setTimeout(() => {

            hideMessage(msg);

        }, 3000);

    }

    if (registerMsg && registerMsg.style.display === "block") {

        setTimeout(() => {

            hideMessage(registerMsg);

        }, 3000);

    }

}


/* ============================
   Login Input Validation
============================ */

const loginInputs = [

    "email",

    "password"

];

loginInputs.forEach(id => {

    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", () => {

        if (id === "email") {

            document.getElementById("emailError").textContent = "";

        }

        if (id === "password") {

            document.getElementById("passwordError").textContent = "";

        }

    });

});


/* ============================
   Check Backend Connection
============================ */

async function pingServer() {

    try {

        const response = await fetch(

            `${API_BASE}/health`

        );

        if (response.ok) {

            console.log(

                "Backend Connected Successfully"

            );

        }

    }

    catch (err) {

        console.warn(

            "Backend is Offline."

        );

    }

}


/* ============================
   Initialize Entire Website
============================ */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        checkAuthentication();

        initializeNavbar();

        autoHideAlerts();

        pingServer();

        console.log(

            "%cReWear Initialized Successfully",

            "color:#6f2c91;font-size:14px;font-weight:bold;"

        );

    }

);
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");

mobileMenuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const icon = mobileMenuBtn.querySelector("i");

    if(navLinks.classList.contains("active")){
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    }
    else{
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }

});

// Close menu when a link is clicked
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");

        const icon = mobileMenuBtn.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    });
});