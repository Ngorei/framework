export function googleSignup(attr) {
    const element=new Dom.Components()
     const STG = new Dom.Storage();
     const TOKEN=element.tokenize();
     const opd = STG.bigQuery(attr.select.bigQuery);
      const rows23 = opd.storage.map((row) => ({
        "label": row.title,
        "value": row.id
      }));   
       function handleCredentialResponse(response) {
         console.log("Autentikasi berhasil");
         // Dapatkan token ID
         const idToken = response.credential;
         // Gunakan token ID untuk mendapatkan informasi pengguna
         fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + idToken)
         .then(response => response.json())
         .then(data => {
           element.Brief({
               "elementById": attr.components[1],
               "cradensial"   :attr.endpoint,
               "status"       :"insert", //signin|sigup
               "message"      :"info_signup", 
               "callback"     :"#account", 
               "action": {
                   "password":  ['password',12,     'Buat Password',           '', 'left', 'fa fa-lock',8],
                   "konfirpws": ['password',12,     'Konfirmasi Password','Enter your', 'left', 'fa fa-lock',8],
                   "instansi":  ["select", 12,      attr.select.label,     true, "left", "icon-feather-bookmark", rows23],
                   "nama":      ['hidden', false,   false,                 'Enter your', 'left', false, 3,data.given_name],
                   "email":     ['hidden', false,   false,                 'Enter your', 'left', false, 3,data.email],
                   "avatar":     ['hidden', false,   false,                 'Enter your', 'left', false, 3,data.picture],
               },
               "footer" :{
                     'save':['Mendaftar','success btn-lg btn-block'],
                     "cancel":false,
                     "style":'block',
               },
           "sendCallback": function(formData) {
             if (formData.status ==="success") {
                   element.alert({
                    "elementById":attr.components[2],
                    "class": 'alert alert-outline d-flex align-items-center alert-success ',
                    "icon": 'picons-thin-icon-thin-0699_user_profile_avatar_man_male fs-30px pt-5px',
                    "headline":formData.response.message,
                   })  
             }
               console.log('disini',formData)
 
             if (formData.status ==="error") {
                   element.alert({
                    "elementById":attr.components[2],
                    "class": 'alert alert-outline d-flex align-items-center alert-danger',
                    "icon": 'picons-thin-icon-thin-0699_user_profile_avatar_man_male fs-30px pt-5px',
                    "headline":formData.response.message,
                   })
             }

           }
           })
           $("#"+attr.elementById).hide();
           $(attr.components[0]).show();
           $(attr.components[0]).html(`<li class="list-group-item d-flex align-items-center">
               <img src="${data.picture}" class="wd-30 rounded-circle mg-r-15" alt="">
               <div>
                 <h6 class="tx-13 tx-inverse tx-semibold mg-b-0">${data.given_name}</h6>
                 <span class="d-block tx-11 text-muted">${data.email}</span>
               </div>
             </li>`);
       
         })
         .catch(error => console.error('Error:', error));
       }
       function initializeGoogleSignIn() {
         google.accounts.id.initialize({
           client_id: TOKEN.google.signIn,
           callback: handleCredentialResponse
         });
         google.accounts.id.renderButton(
           document.getElementById("buttonDiv"),
           { theme: "outline", size: "large" }
         );
       }
         const script = document.createElement("script");
         script.src = "https://accounts.google.com/gsi/client";
         script.onload = initializeGoogleSignIn;
         document.body.appendChild(script);

}
