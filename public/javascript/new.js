// async function old_newFormHandler(event) {
//     event.preventDefault();

//     // upload files using HTML type=file and FormData() and fetch
//     const formData = new FormData();
//     const fileField = document.querySelector('input[type="file"]');
//     const title = document.querySelector('input[name="post-title"]').value;
//     const post_text = document.querySelector('textarea[name="post-text"]').value;

//         // create formData object key value pairs
//     formData.append('title', title);
//     formData.append('post_text', post_text);
//     formData.append('image', fileField.files[0]);

//     // send data as formData object 
//     const response = await fetch(`/api/posts`, {
//         method: 'POST',
//         body: formData
//     });

//     if (response.ok) {
//         document.location.replace('/dashboard');
//     } else {
//         alert(response.statusText);
//     }
// }

async function newFormHandler(event) {
    event.preventDefault();

    // upload files using HTML type=file and FormData() and fetch
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

    if (!title || title.trim().length < 1) {
        alert('The title must be specified.');
        return;
    }
    if (!post_text || post_text.trim().length < 1) {
        alert('The description must be specified.');
        return;
    }    

        // create formData object key value pairs
    formData.append('title', title);
    formData.append('post_text', post_text);

    // send data as formData object
    var image = fileField.files[0];
    if (image) {
        var reader = new FileReader();
        reader.addEventListener("load", async function(e) {
            var dataUrl = e.target.result;
            formData.append('image', dataUrl);
            await createPost('/api/posts', formData);
        });
        reader.readAsDataURL(image);
    } else {
        //NOTE - the files[0] is an object that will show "undefined" in
        // console.log statements, but it is actual object, so don't pass
        // it if an image is not specified or you'll be deceived into thinking
        // that an "undefined" object is passing truthy checks onthe backend!
        //formData.append('image', fileField.files[0]);
        await createPost('/api/posts', formData);
    }
}

async function createPost(url, formData) {
    var formObject = {
        method: 'POST',
        body: formData
    };
    const response = await fetch(url, formObject);
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('#new-post-form').addEventListener('submit', newFormHandler);