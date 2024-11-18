export function googleSignin(attr) {
    console.log(attr.elementById)
 function initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: "843417134039-dthnnbnq199sfvrnf1ie3l3idda4ucvc.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });

    // Tambahkan event listener ke tombol kustom
    document.getElementById(attr.elementById).addEventListener("click", () => {
      google.accounts.id.prompt();
     
    });

  }

    function handleCredentialResponse(response) {
      // Dapatkan token ID
      const idToken = response.credential;
      // Gunakan token ID untuk mendapatkan informasi pengguna
      fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + idToken)
      .then(response => response.json())
      .then(data => {
        console.log("Data Profil:", data);
      })
      .catch(error => console.error('Error:', error));
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

}
