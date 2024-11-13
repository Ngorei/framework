import { setCookie, Rtdb,OauthIN} from "../ngorei.js";
export function googleSignin(attr) {
  const element = new Dom.Components();
  const STG = new Dom.Storage();
  const dbstorage = new Rtdb().localStorage();
  const TOKEN = element.tokenize();
  function initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id:
        "843417134039-dthnnbnq199sfvrnf1ie3l3idda4ucvc.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    // Tambahkan event listener ke tombol kustom
    document.getElementById(attr.elementById).addEventListener("click", () => {
      google.accounts.id.prompt();
    });
  }

  function handleCredentialResponse(response) {
    console.log("Autentikasi berhasil");
    // Dapatkan token ID
    const idToken = response.credential;
    // Gunakan token ID untuk mendapatkan informasi pengguna
    fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
      .then((response) => response.json())
      .then((data) => {
        const from = STG.Brief({
          endpoint: attr.endpoint,
          status: "signin",
          username: data.email,
        });

        if (from.status === "success") {
          var alert = "alert-success";
        } else {
          var alert = "alert-primary";
        }

        element.alert({
          elementById: attr.message,
          icon: "picons-thin-icon-thin-0699_user_profile_avatar_man_male fs-30px pt-5px",
          class: "alert alert-outline d-flex align-items-top " + alert,
          headline: from.message,
        });
        $("#" + attr.elementById).hide();
        if (from.status === "success") {
          setTimeout(() => {
            dbstorage.setItem("oauth", from.token);
            const Token = element.tokenize();
            var uid = element.getToken(from.token);
            // setCookie("oauth_id", true);
            setCookie("oauth_id",from.token);
            element.OAuthID(uid.name);
            if (Token.development === "dashboard") {
              OauthIN(uid);
              setTimeout(() => {
                  window.location.href = Token.account;
              }, 3000); // Mengarahkan ke URL setelah 5 detik
            } else {
              onLink(Token.account);
            }
          }, 2000);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = initializeGoogleSignIn;
  document.body.appendChild(script);
}
