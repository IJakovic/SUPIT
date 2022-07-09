$(document).ready(function () {

    //Load components
    $("#header").load("components/navbar.html"); 
    $("#footer").load("components/footer.html"); 

    //Fancybox - image gallery
    if (document.URL.includes("news1.html")) {
      Fancybox.bind('[data-fancybox="gallery"]', {
        infinite: true
      });
    }
    //Curriculum
/*
    $('#curriculumSearch').autocomplete({
      source: "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan",
      select: function(event, ui){
        $("#curriculumSearch").val(ui.item.label);

        return false;
      }
  });
*/

    function getAllCurriculums() {
          let response = $.ajax({
              type: "GET",
              url: "http://www.fulek.com/VUA/SUPIT/GetNastavniPlan",
              dataType: "json",
              error: function (xhr, ajaxOptions, thrownError) {
                  alert(xhr.status);
                  alert(thrownError);
              }
          });
          return response.responseJSON;
      }

      function getCurriculum(id) {
        let response = $.ajax({
            type: "GET",
            url: "http://www.fulek.com/VUA/supit/GetKolegij/" + id,
            dataType: "json",
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
        return response.responseJSON;
    }

    removeCurriculumClick(element)
    {
        let currentECTS = parseInt($("#totalECTS").html()); //TRENUTNI ECTS BODOVI
        let currentHours = parseInt($("#totalHours").html()); //TRENUTNI SATI
 
        let elementTr = $(element).parent().parent()[0]; //UZMI TR OD THIS ELEMENTA
        let gECTS = parseInt(elementTr.cells[1].innerText); //OD UZETOG TR-A UZMI ECTS BODOVE TE IH PRETVORI U INT
        let gHours = parseInt(elementTr.cells[2].innerText); //OD UZETOG TR-A UZMI SATE TE IH PRETVORI U INT
        
        $(elementTr).remove(); //IZBRIŠI REDAK U TABLICI

        $("#totalECTS").html(currentECTS-gECTS); //ZAPIŠI ECTS-OVE NAKON ODUZIMANJA IBRISANOG TR-A
        $("#totalHours").html(currentHours-gHours); //ZAPIŠI SATE NAKON ODUZIMANJA IBRISANOG TR-A
    }

    $("#curriculum-table").hide();

    //DOHVATI KOLEGIJE
    let curriculum = new getCurriculum();
    let arrayOfCurriculums = curriculum.getAllCurriculums();
    //--//

    //NA AUTO COMPLETE
    $( "#curriculum-search").autocomplete({
        minLength: 0,
        source: arrayOfCurriculums,
        select: function(event, ui) { 
            $('#curriculum-search').val(ui.item.label);
            $('#curriculum-search').attr('data-id', ui.item.value);
            let totalECTS = parseInt($("#totalECTS").html());
            let totalHours = parseInt($("#totalHours").html());
            

            let specificCurriculum = curriculum.getAllCurriculums(parseInt(ui.item.value));
            totalECTS += specificCurriculum.ects;
            totalHours += specificCurriculum.sati;
            $("#cTable-body").append(`
            <tr>
                <td class="text-left">${specificCurriculum.kolegij}</td>
                <td class="text-left">${specificCurriculum.ects}</td>
                <td class="text-left">${specificCurriculum.sati}</td>
                <td class="text-left">${specificCurriculum.predavanja}</td>
                <td class="text-left">${specificCurriculum.vjezbe}</td>
                <td class="text-left">${specificCurriculum.tip}</td>
                <td class="text-left">
                <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 removeCurriculum" type="button" style="transition: all .15s ease">
                Obriši
                </button>
              </td>
            </tr>
            `);
            
            $("#totalECTS").html(totalECTS);
            $("#totalHours").html(totalHours);

            $("#curriculum-icon").hide();
            $("#curriculum-table").show();


            return false;
        },
        response: function(event, ui) {
            if (!ui.content.length) {
                var noResult = { value:"",label:"Kolegij ne postoji u bazi!" };
                ui.content.push(noResult);
            }
        }
    });
    //--//

    //MAKNI KOLEGIJ
    $(document).on("click", ".removeCurriculum", (e) => curriculum.removeCurriculumClick(e.target));
    //--//


});