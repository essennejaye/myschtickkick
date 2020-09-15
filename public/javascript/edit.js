async function editFormHandler(event) {
    event.preventDefault();

    // const title = document.querySelector('input[name="post-title"]').value;
    // const body = document.querySelector('textarea[name="post-body"]').value;

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const post_text = document.querySelector('textarea[name="post-body"]').value.trim();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    console.log('the edit post id is ', id);
    if (title && post_text) {
        console.log('the post name and text are ', title, post_text, id);
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                post_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('You must fill in title and provide some content', response.statusText)
        }
    };
}
const deleteClickHandler = async function (event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert('That post was not found')
    }
};

document.querySelector('#edit-post-form').addEventListener('submit', editFormHandler);
document.querySelector('#delete-btn').addEventListener('click', deleteClickHandler);