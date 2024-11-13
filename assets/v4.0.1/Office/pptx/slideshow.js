export function slideshow(attr) {
	console.log('slideshowktlg38w045p',attr)
  const STG = new Dom.Storage();
    const Fls = new Dom.Components();
  const red34 = STG.fetch({
       "5272E-23DB0-56C88-18503":["setQuery","categori='"+attr+"'"]
  });
  const Aside=JSON.parse(red34.storage.data.setQuery);
  $("#"+attr).html(`<div class="my-slideshow">
        <div class="slideshow-container" id="${Aside.elementById}"></div>
        <div class="dot-container" id="dot-container"></div>
    </div>
    <div id="my-slideshow-viewbox" class="my-slideshow-viewbox">
        <span class="my-slideshow-viewbox-close">&times;</span>
        <img class="my-slideshow-viewbox-content" id="my-slideshow-viewbox-image">
        <div id="my-slideshow-viewbox-caption" class="my-slideshow-viewbox-caption"></div>
    </div>`);
  console.log(JSON.parse(red34.storage.data.setQuery))

       Fls.slider({
           elementById:Aside.elementById,
           data:Aside.data,
           autoSlide:true,
           nextSlide:5000
         })
}