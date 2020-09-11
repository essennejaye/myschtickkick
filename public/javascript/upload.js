async function newPostFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_text = document.querySelector('textarea[name="post-text"]').value.trim();
    const image = document.querySelector('input[type=file]')

    const response = await fetch('/api/post', {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_text,
            image
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}
document.querySelector('.new-post-form').addEventListener('submit', newPostFormHandler);