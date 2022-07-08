$(document).ready(function () {

    //Load components
    $("#header").load("components/navbar.html"); 
    $("#footer").load("components/footer.html"); 

    //Fancybox - image gallery
    if (document.URL.includes("news1.html") ) {
      Fancybox.bind('[data-fancybox="gallery"]', {
        infinite: true
      });
    }

    //Curriculum
    let getAllCurriculum = $.ajax({
      type: "GET",
      url: "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan",
      dataType: "json",
      success: function (response) {
        console.log(response);
      }
    });

    $("#curriculumSearch").autocomplete({
      minLength: 0,
      source: getAllCurriculum,
      select: function(event, ui) { 
          $("#curriculumSearch").val(ui.item.label);
      }
    });
});