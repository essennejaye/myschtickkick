async function newFormHandler(event) {
    event.preventDefault();

    // upload files using HTML type=file and FormData() and fetch
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

        // create formData object key value pairs
    formData.append('title', title);
    formData.append('post_text', post_text);
    formData.append('image', fileField.files[0]);

    // send data as formData object 
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('#new-post-form').addEventListener('submit', newFormHandler);