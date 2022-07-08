$(document).ready(function () {

    //Loading components
    $("#header").load("components/navbar.html"); 
    $("#footer").load("components/footer.html"); 

    //Lightbox
    Fancybox.bind('[data-fancybox="gallery"]', {
      infinite: true
    });

    //Curriculum

});