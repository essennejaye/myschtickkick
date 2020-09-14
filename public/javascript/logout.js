// async function logout() {
//     const response = await fetch('/api/users/logout', {
//         method: 'post',
//         headers: { 'Content-Type': 'application/json' }
//     });

//     if (response.ok) {
//         document.location.replace('/');
//     } else {
//         alert(response.statusText);
//     }
// }

function logout() {
    fetch("/api/users/logout", {
      method: "post",
      headers: { "Content-Type": "application/json" }
    })
      .then(function() {
          console.log('Loggingg out complete')
        document.location.replace("/");
      })
      .catch(err => console.log(err));
  }
  

document.querySelector('#logout-link').addEventListener('click', logout);