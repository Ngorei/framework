const App=Ngorei.App({
       "indexOn"       :'#app',
       "version"       :'v4.0.1',
       "container"     :'#container',
       "rewriteRule"   :'public',
       "sitename"      :'Tatiye',
       "favicon"       :"logo.png",
       "images"        :"data.png",
       "title"         :"Dashboard",
       "description"   :"Platform terintegrasi yang dirancang khusus untuk Pemerintah Kabupaten Pohuwato",
       "sitemap"       :false,
       "development"   :true,
       "assets" :{
             "header":[ 
                // ICON
                "assets/lib/icon/icon.css",
                "assets/css/animate.min.css",
                "assets/css/bootstrap.css",
     
             ],
             "footer":[
                "assets/js/jquery.min.js", 
                "assets/js/jquery-ui.min.js",
                "assets/js/bootstrap.bundle.min.js",
                "module|assets/v4.0.1/ngorei.js",
                "module|App.js",
                "module|Assets.js",
             ]
        },
       "components"    :"Components",
       "element"       :{
         "spinner" :{
             "color" :'primary',// primary | secondary | success | danger | warning | info | light | dark
             "class" :'text-center spinner-container',
             "type"  :'spinner-border', //spinner-border |spinner-border spinner-border-sm
             "thread"  :{
                 "color" :'primary',
                 "class" :'text-center',
                 "type"  :'spinner-border',
             }
         } 
       }, 
       });
       App.navigasi({ 
           "home":{  
               "home":        ["Home",          "home"],
               "web":         ["web",           "web/index"],
               "seluler":     ["seluler",          "seluler/index"],
          }
     });
       