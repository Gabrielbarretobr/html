var github = {
    auth: "?client_id=d7125c669427ba3e35c1&client_secret=b0698c55bf1bc5e5a306136d1988bbfa40f851ef",
    contribsUrl: "",
    commitsUrl: "",
    page: "",
    init: function() {
        $.ajax({
            type: "GET",
            url: "https://api.github.com/users/mundipagg/repos",
            dataType: "json",
            statusCode: {
                404: function() {
                    console.log( "page not found" );
                }
            },
            success: function(result) {
                result.sort(function(a, b) {
                    return b.stargazers_count - a.stargazers_count }
                );

                var appendResults = function() {
                    $("#repositories").append(
                        "<li class='project-item form-control'><a href='javascript:void(0)' class='project' data-title='" + result[i].name + "' data-stars='" + result[i].stargazers_count + "' data-forks='" + result[i].forks + "' data-contribs-url='" + result[i].contributors_url + "' data-commits-url='" + result[i].commits_url.replace("{/sha}", '') + "'>" +
                        result[i].name + "</a><span class='arrow-active'></span></li>"
                    );
                };

                for(i in result) {
                    appendResults();
                }
            }
        });
    },
    getCommit: function() {
        var htmlResult = "";

        $.ajax({
            type: "GET",
            url: github.commitsUrl + github.auth + "&page=" + github.page + "&per_page=20",
            dataType: "json",
            statusCode: {
                404: function() {
                    console.log( "page not found" );
                }
            },
            success: function(result) {
                var Janeiro= 0,
                    Fevereiro = 0,
                    Marco = 0,
                    Abril = 0,
                    Maio = 0,
                    Junho = 0,
                    Julho = 0,
                    Agosto = 0,
                    Setembro = 0,
                    Outubro = 0,
                    Novembro = 0,
                    Dezembro = 0;

                for(i in result) {
                    var numberCommits = result,
                        a = numberCommits.length,
                        v = github.formatCommitDate(result[i].commit.committer.date),
                        cont = v.slice(3,5),
                        res = parseInt(cont);

               
                       switch (res) {
                        case 01:
                            Janeiro = +i;
                            break;
                        case 02:
                            Fevereiro = +i;
                            break;
                        case 03:
                            Marco = +i;
                            break;
                        case 04:
                            Abril = +i;
                            break;
                        case 05:
                            var Maio = +i;
                            break;
                        case 06:
                            var Junho = +i;
                            break;
                        case 07:
                            var Julho = +i;
                            break;
                        case 08:
                            var Agosto = +i;
                            break;
                        case 09:
                            var Setembro = +i;
                            break;
                        case 10:
                            var Outubro = +i;
                            break;
                        case 11:
                            var Novembro = +i;
                            break;
                        case 12:
                            var Dezembro = +i;
                            break;

                        default:

                            break;
                    }
                
                    var dataMouth = [
                        Janeiro,
                        Fevereiro,
                        Marco,
                        Abril,
                        Maio,
                        Junho,
                        Julho,
                        Agosto,
                        Setembro,
                        Outubro,
                        Setembro,
                        Dezembro
                     ]

                    try {
                        $("#commitsa").text("Total de Commits " + a);
                        htmlResult += "<li class='commit-item js-show data-commits='" + result[i] + "'><img class='photo' src='" + result[i].committer.avatar_url + " width='50' height='50'><article class='commit'><div class='outer'><h2 class='commit-title'>" + result[i].commit.message + "</h2><p class='commit-user'>@" + result[i].committer.login + "</p></div></article><time class='commit-date'>" + github.formatCommitDate(result[i].commit.committer.date) + "</time></li>";
                    } catch(err) {
                        htmlResult += "<li class='commit-item js-show'><img class='photo' src='' width='50' height='50'><article class='commit'><div class='outer'><h2 class='commit-title'>" + result[i].commit.message + "</h2><p class='commit-user'>@</p></div></article><time class='commit-date'>" + github.formatCommitDate(result[i].commit.committer.date) + "</time></li>";
                    }
                }
                    var ctx = document.getElementById('myChart').getContext('2d');
                    var chart = new Chart(ctx, {
                            // The type of chart we want to create
                            type: 'line',
                            // The data for our dataset
                            data: {
                                labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                                datasets: [{
                                    label: "Commits por Mês",
                                    backgroundColor: 'transparent',
                                    borderColor: '#082659',
                                    data: dataMouth,
                                }]
                            },

                            // Configuration options go here
                            options: {}
                        });

                 
                $("#commits").append(htmlResult);               
            }
        });
        github.page = github.page + 1;
    },
    getContribs: function() {
        $.ajax({
            type: "GET",
            url: github.contribsUrl + github.auth,
            dataType: "json",
            success: function(result) {
                var contribs = result.length;
                $("#contribs").text("Total de Contribs " + contribs);
            }
        });
    },
    formatCommitDate: function(selectedDate) {
        newDate = new Date(selectedDate);
        function pad(s) { return (s < 10) ? "0" + s : s; }
        return [pad(newDate.getDate()), pad(newDate.getMonth()+1), newDate.getFullYear()].join("/");
    },
    showMore: function() {
        github.getCommit();
    }
};

$(document).ready(function() {
    github.init();
            $("#myChart").hide();
            $(".list-h.stats").hide();
    $(document).on("click", ".project", function(){
        var stars = $(this).data("stars");
        var forks = $(this).data("forks");
        var repoName = $(this).data("title");
        var commitDate = $(this).data('commit-date');


        github.contribsUrl = $(this).data("contribs-url");
        github.commitsUrl = $(this).data("commits-url");
        github.page = 1;

        $(".project-item").removeClass("active");
        $(this).closest(".project-item").addClass("active");

        //window.history.replaceState(repoName, repoName, repoName);
        $("#myChart").show();
        $(".list-h.stats").show();
        $("#stars").text("Total de Stars " + stars);
        $("#forks").text("Total de Forks " + forks);

        $(".commit-item").remove();

        github.getContribs();
        github.getCommit();
    });

$(document).ready(function() {
    $('#search').hideseek({
     nodata: 'Nenhum Repositorio encontrado',
     highlight: false,
     hidden_mode: false
    });
});

    $("#showMore").on("click", github.showMore);
});