$(function(){
	$(window).bind('scroll', function () {
        if ($(window).scrollTop() > 600) {
            $('#buttons').addClass('fixed');
            $('#buttons').css('top','0px');
        }
        else{
        	$('#buttons').removeClass('fixed');
        	$('#buttons').css('top',(600-$(document).scrollTop()) + 'px');
        }
    });

	var codepts = ['Reset', 'Computer Science','Mathematics','Economics', 'Mechanical Engineering and Materials Science', 'Electrical and Computer Engineering', 'Civil and Environmental Engineering', 'Biomedical Engineering', 'Art, Art History and Visual Studies', 'Asian and Middle Eastern Studies', 'Biology', 'Chemistry', 'Classical Studies', 'Cultural Anthropology', 'Dance', 'Education', 'English','Evolutionary Anthropology', 'Germanic Languages', 'History', 'Linguistics', 'Literature', 'Music', 'Philosophy', 'Political Science', 'Psychology and Neuroscience', 'Religious Studies', 'Romance Studies', 'Sociology', 'Statistical Science', 'Theater Studies', "Women's Studies"];
    var indepts = ["Computational Biology and Bioinformatics", 'Information Initiative at Duke', 'Machine Learning', 'Applied Math', 'Computational Mechanics and Scientific Computing', 'Computational Materials Science', 'CS-ECON@DUKE', 'Computational Neuroscience', 'Theory Group'];
    for (i = 0; i < codepts.length; i++) {
        $('#buttons').append("<button type='button' class='depts'>" + codepts[i] + "</button>");
    }
    for (i = 0; i < indepts.length; i++) {
        $('#buttons').append("<button type='button' class='depts'>" + indepts[i] + "</button>");
    }
    $('#buttons').append('<div id="resultstats"></div>');
    
    var statsstr = " ";
    statsstr = "<p class='statvalue'>Affliated professors: " + "0" + ", ";
    statsstr += "Interdiscipline professors: " + "0" + " </p>";
    document.getElementById("resultstats").innerHTML = statsstr;
    
    var beClicked = [];
    $("button").click(function(){
        if ($(this).text() == "Reset") {
            $('.depts').css("background-color", "white");
            $('.depts').css("color", "black");
            beClicked = [];
        } else {
            if (beClicked.indexOf($(this).text()) > -1) {
                var index = beClicked.indexOf($(this).text());
                beClicked.splice(index, 1);
                $(this).toggleClass("unhighlight");
            } else {
                $(this).toggleClass("highlight");
                beClicked.push($(this).text());
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myFunction(xmlhttp);}
        };
        xmlhttp.open("GET", "https://dl.dropboxusercontent.com/s/ffwi0139yzicq7t/tpdata.xml?dl=0", true);
        /*https://dl.dropboxusercontent.com/s/hmybk7q94bh3iyn/tridata.xml?dl=0*/
        /*https://dl.dropboxusercontent.com/s/c6s8mgoxbea45kf/csdata.xml?dl=0*/
        /*https://dl.dropboxusercontent.com/s/ffwi0139yzicq7t/tpdata.xml?dl=0*/
        xmlhttp.send();
    });

    var directproflist = [];
    var linkedproflist = [];
    function myFunction(xml) {
        $('#xmloutput').css("margin-top", "220px");
        directproflist = [];
        linkedproflist = [];
        var i, j, k;
        var xmlDoc = xml.responseXML;
        var x = xmlDoc.getElementsByTagName("person");
        for (j = 0; j < x.length; j++) {
            var thisprof = x[j];
            if (beClicked.indexOf(thisprof.getAttribute("dept")) != -1) {
                // check whether this professor is in linked.
                directproflist.push(thisprof);
                var found = false;
                for (k = 0; k < thisprof.getElementsByTagName("codept").length; k++) {
                    var thiscodeptname = thisprof.getElementsByTagName("codept")[k].getAttribute("name");
                    if (thiscodeptname == thisprof.getAttribute("dept")) continue;
                    if (beClicked.indexOf(thiscodeptname) != -1) {
                        found = true;
                    }
                }
                for (k = 0; k < thisprof.getElementsByTagName("inter").length; k++) {
                    var thiscodeptname = thisprof.getElementsByTagName("inter")[k].getAttribute("name");
                    if (beClicked.indexOf(thiscodeptname) != -1) {
                        found = true;
                    }
                }
                if (found) linkedproflist.push(thisprof);
            }
        }
        format();
    };

    function format() {
        // secondly, the formate of table of professors
        i = 0; var outputstr = "";
        var thisprof, profid, profname, profdept, coordept, partid;

        // list of interdiscipline professors
        // need to display linked degree
        var thisstr;
        thisstr = "<div class = 'lprofs' id='lproflog'>Interdiscpline professors found: " + linkedproflist.length + "</div>";
        outputstr += thisstr;
        for (i = 0; i < linkedproflist.length; i++) {
            thisprof = linkedproflist[i];
            profid = thisprof.getAttribute("id");
            partid = profid.substring(3);
            profname = thisprof.getAttribute("name");
            profdept = thisprof.getAttribute("dept");
            coordept = thisprof.getElementsByTagName("codept");
            profinter = thisprof.getElementsByTagName("inter");
            // here comes formating
            thisstr = "<div class = 'lprofs'>";
            thisstr += "<img class='profimage' src= 'https://scholars.duke.edu/file/t"+partid+"/thumb_image_"+partid+".jpg' />"
            thisstr += "<div class='showstat'>";
            thisstr += "<a class='profname' href='https://scholars.duke.edu/display/" + profid + "' target='_blank'>" + profname + "</a> ";
            thisstr += "<a class='profdept'> &nbsp; (" + profdept + ")</a>";
            if (profinter.length > 0) {
                thisstr += "<p class='inter'>Interdiscipline Institution:";
                for (n = 0; n < profinter.length; n++) {
                    thisstr += "&nbsp; <a href='" + profinter[n].getAttribute("link")+ "'>" + profinter[n].getAttribute("name")+ "</a>";
                }
                thisstr += "</p>";
            }
            if (thisprof.hasAttribute("research")) {thisstr += "<p class='profrese'>" + thisprof.getAttribute("research") + "</p>";}
            thisstr += "<p class='codept'>";
            for (m = 0; m < coordept.length; m++) {
                thisstr += coordept[m].getAttribute("name") + ":  " + coordept[m].getAttribute("weight")+ "<br>";
            }
            thisstr += "</p>";
            // then we can add linked degree
            thisstr += "</div></div>";
            outputstr += thisstr;
        }

        // list of affiliated professor
        // no need to display linked degree
        thisstr = "<div class = 'aprofs' id='aproflog'>Affliated professors found: " + directproflist.length + "</div>";
        outputstr += thisstr;
        for (i = 0; i < directproflist.length; i++) {
            thisprof = directproflist[i];
            profid = thisprof.getAttribute("id");
            partid = profid.substring(3);
            profname = thisprof.getAttribute("name");
            profdept = thisprof.getAttribute("dept");
            coordept = thisprof.getElementsByTagName("codept");
            profinter = thisprof.getElementsByTagName("inter");
            // here comes formating
            thisstr = "<div class = 'aprofs'>";
            thisstr += "<img class='profimage' src= 'https://scholars.duke.edu/file/t"+partid+"/thumb_image_"+partid+".jpg' />"
            thisstr += "<div class='showstat'>";
            thisstr += "<a class='profname' href='https://scholars.duke.edu/display/" + profid + "' target='_blank'>" + profname + "</a> ";
            thisstr += "<a class='profdept'> &nbsp; (" + profdept + ")</a>";
            if (profinter.length > 0) {
                thisstr += "<p class='inter'>Interdiscipline Institution:";
                for (n = 0; n < profinter.length; n++) {
                    thisstr += "&nbsp; <a href='" + profinter[n].getAttribute("link")+ "'>" + profinter[n].getAttribute("name")+ "</a>";
                }
                thisstr += "</p>";
            }
            if (thisprof.hasAttribute("research")) {thisstr += "<p class='profrese'>" + thisprof.getAttribute("research") + "</p>";}
            thisstr += "<p class='codept'>";
            for (m = 0; m < coordept.length; m++) {
                thisstr += coordept[m].getAttribute("name") + ":  " + coordept[m].getAttribute("weight")+ "<br>";
            }
            thisstr += "</p>";
            // then we can add linked degree
            thisstr += "</div></div>";
            outputstr += thisstr;
        }
        document.getElementById("xmloutput").innerHTML = outputstr; 

        // first, need to output how many professors are found in buttons section
        statsstr = "<p class='statvalue'><a href='#aproflog'>Affliated professors: " + directproflist.length + "</a>&nbsp;&nbsp;";
        statsstr += "<a href='#lproflog'>Interdiscipline professors: " + linkedproflist.length + "</a></p>";
        statsstr += "<p class='statvalue'>Chosen departments: " + beClicked + "</p>";
        document.getElementById("resultstats").innerHTML = statsstr;
    };
});