var urlPage = "https://ijakovic.github.io/SUPIT/";
var urlLocalHost = "http://127.0.0.1:5500/";

$(document).ready(function () {

    /******Load components******/
    $("#navbar").load("./components/navbar.html");
    $("#footer").load("./components/footer.html");

    /******Fancybox - image gallery******/
    if (document.URL.includes("news1.html")) {
        Fancybox.bind('[data-fancybox="gallery"]', {
            infinite: true
        });
    }

    /******Curriculum page******/
    if (document.URL.includes("curriculum.html")) {
        $("#curriculum-table").hide();

        //Info:
        //https://www.w3schools.com/xml/ajax_intro.asp
        //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
        var urlGetAllCurriculums = 'http://www.fulek.com/VUA/SUPIT/GetNastavniPlan';
        var xmlhttpGetAllSubjects = new XMLHttpRequest();
        xmlhttpGetAllSubjects.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var allSubjects = JSON.parse(this.responseText);

                //Autocomplete on input field
                $('#curriculum-search').autocomplete({
                    source: allSubjects,
                    minLength: 1,
                    focus: function( event, ui ) {
                        event.preventDefault();
                        $('#curriculum-search').val(ui.item.label);
                    },
                    select: function (event, ui) {
                        event.preventDefault();
                        $("#curriculum-search").val(ui.item.label);
                    }
                })

                //For the selected autocomplete field, append it to table row inside table body
                $('#curriculum-search').on('autocompleteselect', function (e, ui) {
                    var id = ui.item.value;
                    var urlGetCurriculum = `http://www.fulek.com/VUA/supit/GetKolegij/${id}`;
                    var xmlhttpGetSubject = new XMLHttpRequest();
                    xmlhttpGetSubject.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var subject = JSON.parse(this.responseText);

                            $("#curriculum-table-body").append(
                                `
                                <tr id="curriculum-table-row">
                                    <td scope="row">${subject.kolegij}</td>
                                    <td id="ects">${subject.ects}</td>
                                    <td id="hours">${subject.sati}</td>
                                    <td>${subject.predavanja}</td>
                                    <td>${subject.vjezbe}</td>
                                    <td>${subject.tip}</td>
                                    <td><button type="button" id="btn-delete" class="btn btn-outline-danger fs-5">Obriši</button></td>
                                </tr>
                                `
                            );

                            if ($('#curriculum-table-row').length > 0) {
                                $("#curriculum-table").show();
                            }

                            //Sum the total of ECTS and Hours for each added row
                            var totalECTS = 0;
                            var totalHours = 0;

                            $('#curriculum-table-body tr#curriculum-table-row').each(function () {
                                var sumECTS = +$(this).find("td#ects").text();
                                totalECTS += sumECTS;
                                var sumHours = + $(this).find("td#hours").text();
                                totalHours += sumHours;
                            })
                            $('#totalECTS').text(totalECTS);
                            $('#totalHours').text(totalHours);
                        }

                        //Delete table row and hide the table if there's no more row in table body
                        $('#curriculum-table-body #curriculum-table-row').on('click', 'button', function () {
                            $(this).parent().parent().remove();

                            if ($('#curriculum-table-row').length == 0) {
                                $("#curriculum-table").hide();
                            }

                            //Update the total of ECTS and hours when a row has been deleted
                            var updateECTS = 0;
                            var updateHours = 0;

                            $('#curriculum-table-body tr#curriculum-table-row').each(function () {
                                var resumECTS = parseInt($(this).find("td#ects").text(), 10);
                                updateECTS += resumECTS;
                                var resumHours = parseInt($(this).find("td#hours").text(), 10);
                                updateHours += resumHours;
                            })
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
    }

    /******Animate On Scroll******/
    AOS.init({
        duration: 600,
        mirror: true
    });
});
