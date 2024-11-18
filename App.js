const App=Ngorei.App({
       "version"       :'v4.0.1',
       "indexOn"       :'#app',
       "container"     :'#container',
       "rewriteRule"   :'public',
       "sitename"      :'Ngorei',
       "favicon"       :"favicon.png",
       "images"        :"logo.png",
       "title"         :"Ngorei - framework",
       "description"   :"Berkreasi! Dengan fokus pada HTML, CSS, dan JavaScript standar, membangun website biasa, namun dengan hasil yang luar biasa.",
       "sitemap"       :false,
       "development"   :false,
       "precodeprismjs":false,
       "assets" :{
             "header":[ 
                "assets/lib/icon/icon.css",
                "assets/css/animate.min.css",
                "assets/css/bootstrap.css"
             ],
             "footer":[
                "assets/lib/jquery.min.js", 
                "assets/lib/jquery-ui.min.js",
                "assets/lib/bootstrap.bundle.min.js",
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
               "seluler":     ["seluler",       "seluler/index"],
              }
     });
   