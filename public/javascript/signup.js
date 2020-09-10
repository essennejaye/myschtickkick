const signupFormHandler = async function(event) {
    event.preventDefault();

    const usernameSignup = document.querySelector("#username-input-signup");
    const passwordSignup = document.querySelector("#password-input-signup");

    fetch("/api/user", {
        method: "post",
        body: JSON.stringify({
            username: usernameSignup.value,
            password: passwordSignup.value
        }), 
        headers
    })
}














document.querySelector("#signup-form");
document.addEventListener("submit", signupFormHandler);