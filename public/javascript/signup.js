async function signupFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector("#username-input-signup").value.trim();
    const password = document.querySelector("#password-input-signup").value.trim();
    const email = document.querySelector("#email-input-signup").value.trim();

    if (username && email && password) {
        const response = await fetch("/api/user", {
            method: "post",
            body: JSON.stringify({
                username,
                password,
                email
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/dashboard/');
        } else {
            alert(response.statusText);
        }
    }
}


document.querySelector("#signup-form").addEventListener("submit", signupFormHandler);