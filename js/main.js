$(document).ready(function () {

    /******Load components******/
    $("#header").load("components/navbar.html"); 
    $("#footer").load("components/footer.html"); 

    /******Fancybox - image gallery******/
    if (document.URL.includes("news1.html")) {
      Fancybox.bind('[data-fancybox="gallery"]', {
        infinite: true
      });
    }

    /******Curriculum page******/
    $("#curriculum-table").hide();
    
    var urlGetAllCurriculums = 'http://www.fulek.com/VUA/SUPIT/GetNastavniPlan';
    var xmlhttpGetAllSubjects = new XMLHttpRequest();

    xmlhttpGetAllSubjects.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var allSubjects = JSON.parse(this.responseText);
        //console.log(allSubjects);
    
        //autocomplete naziva kolegija
        $('#curriculum-search').autocomplete({
          source: allSubjects,
          minLength: 1,
          select: function(event, ui){
            event.preventDefault();
            $("#curriculum-search").val(ui.item.label);
          }
        })
    
        //prikaz detalja pojedinog kolegija
          $('#curriculum-search').on('autocompleteselect', function (e, ui) {
            var id =  ui.item.value;
            var urlGetCurriculum = `http://www.fulek.com/VUA/supit/GetKolegij/${id}`;
            var xmlhttpGetSubject = new XMLHttpRequest();

            xmlhttpGetSubject.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                var mySubject = JSON.parse(this.responseText);
                //template za pojedini kolegij
                $("#curriculum-table-body").append(
                    `
                      <tr id="curriculum-table-row">
                          <td scope="row">${mySubject.kolegij}</td>
                          <td id="ects">${mySubject.ects}</td>
                          <td id="hours">${mySubject.sati}</td>
                          <td>${mySubject.predavanja}</td>
                          <td>${mySubject.vjezbe}</td>
                          <td>${mySubject.tip}</td>
                          <td><button type="button" id="btn-delete" class="btn btn-outline-danger">Obriši</button></td>
                      </tr>
                    `
                );
                
                if ($('#curriculum-table-row').length > 0) {
                    $("#curriculum-table").show();
                  }
    
                //sum ects i sati
                var totalECTS = 0;
                var totalHours = 0;
    
                $('#curriculum-table-body tr#curriculum-table-row').each(function() {
                  var sumECTS = +$(this).find("td#ects").text();
                  totalECTS += sumECTS;
                  var sumHours =+ $(this).find("td#hours").text();
                  totalHours += sumHours;
                })
                //console.log("test sum nakon dodavanja:" + sum);
                $('#totalECTS').text(totalECTS);
                $('#totalHours').text(totalHours);
              }
    
              // brisanje tr - (pojedinog kolegija)

              $('#curriculum-table-row').on('click', 'button', function(){
                $(this).parent().parent().remove();

                if ($('#curriculum-table-row').length == 0) {
                    $("#curriculum-table").hide();
                }
    
                var updateECTS = 0;
                var updateHours = 0;
    
                $('#curriculum-table-body tr#curriculum-table-row').each(function() {
                  var sum_ects = parseInt($(this).find("td#ects").text(), 10);
                  updateECTS += sum_ects;
                  var sum_sati = parseInt($(this).find("td#hours").text(), 10);
                  updateHours += sum_sati;
                  //console.log('kliknuti', sum_ects)
                })
                //console.log("test sum nakon dodavanja:" + sum);
                $('#totalECTS').text(updateECTS);
                $('#totalHours').text(updateHours);
              });
    
            };
            xmlhttpGetSubject.open("GET", urlGetCurriculum, true);
            xmlhttpGetSubject.send();
    
          });
      }
    };
    xmlhttpGetAllSubjects.open("GET", urlGetAllCurriculums, true);
    xmlhttpGetAllSubjects.send();


});