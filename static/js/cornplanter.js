// Set pageID (as an int) to a global variable to use later. Its value ultimately comes from the
// Django database by way of an inline script in the template.
pageID = Math.floor(Page_id);


function initPage(newPageID) {
    if (pageID >= 1 && pageID <= lastpage) {
        pageID = newPageID;
        if (pageID < 10) {
            var newstring = "00" + pageID.toString(); // turn this into string
        } else if (pageID < 100) {
            var newstring = "0" + pageID.toString();
        } else {
            var newstring = pageID.toString();
        }
        var newImgUrl = Manuscript_id + "_" + newstring;
        // Load the image and the transcription
        $('#imgDiv img').remove();
        $('#imgDiv').append("<img src =/static/img/" + newImgUrl + ".jpg></div>");
/*        $.get("/pagetranscription/" + newImgUrl, function (data) {
            $("#transcriptionDiv").html(data).promise().done(initLinks);
        });*/
        window.history.pushState("Page Information", "Page Information", "/page/" + newImgUrl + "/");
    } else {
        alert("Page out of range.");
    }
}

function inPage(newID){
    if(pageID >= 1 && pageID <= lastpage){
        pageID = newID;
        if (pageID < 10) {
            var newstring = "00" + pageID.toString(); // turn this into string
        } else if (pageID < 100) {
            var newstring = "0" + pageID.toString();
        } else {
            var newstring = pageID.toString();
        }
        var newImgUrl = Manuscript_id + "_" + newstring;
    }
    return newImgUrl;
}
$(document).ready(function() {
    //initPage(pageID);
    // This controls what happens when someone uses the close button.
    if (pageID < 1 && pageID > lastpage) {
        alert("Page out of range.");
    } else {
	$.get("/pagetranscription/" + inPage(pageID), function (data) {
            $("#transcriptionDiv").html(data).promise().done(initLinks);
        });
        window.history.pushState("Page Information", "Page Information", "/page/" + inPage(pageID) + "/");
        $("#openseadragon1").html("");
        var viewer = OpenSeadragon({
            id: "openseadragon1",
            prefixUrl: "//openseadragon.github.io/openseadragon/images/",
//          tileSources: "/srv/QI/static/img/Misc_mss_1791_06_02_001.dzi",
//            tileSources: "http://104.131.45.60/img/Misc_mss_1791_06_02_001.dzi"
            tileSources: "http://159.203.172.178/img/"+ inPage(pageID)+ ".dzi"
//          tileSources: duomo
/*            showNavigator: true,
            navigatorPosition: "ABSOLUTE",
            navigatorTop: "40px",
            navigatorLeft: "4px",
            navigatorHeight: "110px",
            navigatorWidth: "90px",
            sequenceMode: true,
            showReferenceStrip: true,
            referenceStripScroll: 'horizontal',*/
        });
    }
    $("i.fa.fa-times").click(function() {
        $('.off-canvas').animate({
            "margin-right": '-=25%'
        });
        $('i.fa.fa-times').animate({
            "margin-right": '-=25%'
        });
        $('.off-canvas div').remove();
    });
    // Go forward in the image viewer.
    $(".forwards-arrow i.fa.fa-chevron-right").click(function() {
        initPage(pageID + 1);
	location.reload();
    });
    // Go backward in the image viewer.
    $(".forwards-arrow i.fa.fa-chevron-left").click(function() {
        initPage(pageID - 1);
	location.reload();
    });
});

function initLinks() {
    console.log($("a").length);
    // This is the function that will be run through every time a persName, orgName, placeName a 
    // href is clicked in the transcription.
    $("a").click(function() {
        console.log("You clicked something!");
        var href = $(this).attr('href');
        var newhref = href.slice(1, href.length);
        $.ajax({
            url: '/something/' + newhref,
            type: 'GET',
            dataType: 'json',
            cache: true,
            success: function (data) {
                openLinkData(data, newhref);
            }
        });
    });
}


function openLinkData(data, newhref) {
    if (data[0]["model"] == "QI.person") {
        if (data[0]["fields"].birth_date == "") {
            data[0]["fields"].birth_date = 'Unknown'
        }
        if (data[0]["fields"].death_date == "") {
            data[0]["fields"].death_date = 'Unknown'
        }
        if (data[0]["fields"].other_names == "") {
            data[0]["fields"].other_names = 'None'
        }
        if (data[0]["fields"].bio_notes == "") {
            data[0]["fields"].bio_notes = 'None'
        }
        //start (#1)
        if (($('.off-canvas div').attr('id')) == undefined) {
            $('.off-canvas').append("<div id = " + newhref + "><br /><h3>Person Information</h3><span> Name </span><p> " + data[0]["fields"].first_name + " " + data[0]["fields"].last_name + "</p><span> Birth Date </span> <p>" + data[0]["fields"].birth_date + "</p> <span> Death Date</span> <p> " + data[0]["fields"].death_date + "</p> <span> Notes </span><p> " + data[0]["fields"].bio_notes + "</p> <span> Alternate Spellings </span> <p>" + data[0]["fields"].other_names + "</p> <span><a href=/person/" + data[0]["fields"].id_tei + "> &rarr; View more information</a></span><p> </div>");
            $('.off-canvas').animate({
                "margin-right": '+=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '+=25%'
            });
        } else if (newhref == ($('.off-canvas div').attr('id'))) {
            $('.off-canvas').animate({
                "margin-right": '-=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '-=25%'
            });
            $('.off-canvas div').remove();
        } else {
            // this is the case when you click on another (different) a href right after clicking a first one
            $('.off-canvas').animate({
                "margin-right": '-=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '-=25%'
            });
            $('.off-canvas div').remove();
            $('.off-canvas').append("<div id = " + newhref + "><br /><h3>Person Information</h3><span> Name </span><p> " + data[0]["fields"].first_name + " " + data[0]["fields"].last_name + "</p><span> Birth Date </span> <p>" + data[0]["fields"].birth_date + "</p> <span> Death Date</span> <p> " + data[0]["fields"].death_date + "</p> <span> Notes </span><p> " + data[0]["fields"].bio_notes + "</p> <span> Alternate Spellings </span> <p>" + data[0]["fields"].other_names + "</p> <span><a href=/person/" + data[0]["fields"].id_tei + "> &rarr; View more information</a></span><p> </div>");
            $('.off-canvas').animate({
                "margin-right": '+=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '+=25%'
            });

        }
    } else if (data[0]["model"] == "QI.place") {
        if (data[0]["fields"].county == "") {
            data[0]["fields"].county = 'Unknown';
        }
        if (data[0]["fields"].state == "") {
            data[0]["fields"].state = 'Unknown';
        }
        if (data[0]["fields"].latitude == "") {
            data[0]["fields"].latitude = 'Unknown';
        } else {
            data[0]["fields"].latitude = data[0]["fields"].latitude + " N"
            data[0]["fields"].longitude = data[0]["fields"].longitude + " W"
        }
        if (data[0]["fields"].notes == "") {
            data[0]["fields"].notes = 'None';
        }
        if (data[0]["fields"].alternate == "") {
            data[0]["fields"].alternate = 'None';
        }
        if (($('.off-canvas div').attr('id')) == undefined) {
            $('.off-canvas').append("<div id = " + newhref + "><br /><h3>Place Information</h3><span> Name </span><p> " + data[0]["fields"].name + "</p><span> County </span> <p>" + data[0]["fields"].county + "</p> <span> State </span> <p> " + data[0]["fields"].state + "</p> <span> Location </span> <p>" + data[0]["fields"].latitude + " " + data[0]["fields"].longitude + "</p> <span> Notes </span><p> " + data[0]["fields"].notes + "</p> <span> Alternate Spellings </span> <p>" + data[0]["fields"].alternate + "</p> <span><a href=/place/" + data[0]["fields"].id_tei + "> &rarr; View more information</a></span><p> </div>");
            $('.off-canvas').animate({
                "margin-right": '+=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '+=25%'
            });
        } else if (newhref == ($('.off-canvas div').attr('id'))) {
            $('.off-canvas').animate({
                "margin-right": '-=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '-=25%'
            });
            $('.off-canvas div').remove();
        } else {
            // this is the case when you click on another (different) a href right after clicking a first one
            $('.off-canvas').animate({
                "margin-right": '-=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '-=25%'
            });
            $('.off-canvas div').remove();
            $('.off-canvas').append("<div id = " + newhref + "><br /><h3>Place Information</h3><span> Name </span><p> " + data[0]["fields"].name + "</p><span> County </span> <p>" + data[0]["fields"].county + "</p> <span> State </span> <p> " + data[0]["fields"].state + "</p> <span> Location </span> <p>" + data[0]["fields"].latitude + " " + data[0]["fields"].longitude + "</p> <span> Notes </span><p> " + data[0]["fields"].notes + "</p> <span> Alternate Spellings </span> <p>" + data[0]["fields"].alternate + "</p> <span><a href=/place/" + data[0]["fields"].id_tei + "> &rarr; View more information</a></span><p> </div>");
            $('.off-canvas').animate({
                "margin-right": '+=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '+=25%'
            });
        }
    } else {
        if (data[0]["fields"].date_founded == "") {
            data[0]["fields"].date_founded = 'Unknown';
        }
        if (data[0]["fields"].date_dissolved == "") {
            data[0]["fields"].date_dissolved = 'Unknown';
        }
        if (data[0]["fields"].notes == "") {
            data[0]["fields"].notes = 'Unknown';
        }
        if (data[0]["fields"].associated_spellings == "") {
            data[0]["fields"].associated_spellings = 'None';
        }
        if (data[0]["fields"].other_names == "") {
            data[0]["fields"].other_names = 'None';
        }
        //start (#1)
        if (($('.off-canvas div').attr('id')) == undefined) {
            $('.off-canvas').append("<div id = " + newhref + "><br /><h3>Organization Information</h3><span> Name </span><p> " + data[0]["fields"].organization_name + "</p><span> Date Founded </span> <p>" + data[0]["fields"].date_founded + "</p> <span> Date Dissolved </span> <p> " + data[0]["fields"].date_dissolved + "</p> <span> Notes </span><p> " + data[0]["fields"].notes + "</p> <span> Associated Spellings </span> <p>" + data[0]["fields"].associated_spellings + "</p> <span> Other Names </span> <p>" + data[0]["fields"].other_names + "</p> <span><a href=/org/" + data[0]["fields"].id_tei + "> &rarr; View more information</a></span><p> </div>");
            $('i.fa.fa-times').animate({
                "margin-right": '+=25%'
            });
            $('.off-canvas').animate({
                "margin-right": '+=25%'
            });
        } else if (newhref == ($('.off-canvas div').attr('id'))) {
            $('.off-canvas').animate({
                "margin-right": '-=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '-=25%'
            });
            $('.off-canvas div').remove();
        } else {
            //this is the case when you click on another (different) a href right after clicking a first one
            $('.off-canvas').animate({
                "margin-right": '-=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '-=25%'
            });
            $('.off-canvas div').remove();
            $('.off-canvas').append("<div id = " + newhref + "><br /><h3>Organization Information</h3><span> Name </span><p> " + data[0]["fields"].organization_name + "</p><span> Date Founded </span> <p>" + data[0]["fields"].date_founded + "</p> <span> Date Dissolved </span> <p> " + data[0]["fields"].date_dissolved + "</p> <span> Notes </span><p> " + data[0]["fields"].notes + "</p> <span> Associated Spellings </span> <p>" + data[0]["fields"].associated_spellings + "</p> <span> Other Names </span> <p>" + data[0]["fields"].other_names + "</p> <span><a href=/org/" + data[0]["fields"].id_tei + "> &rarr; View more information</a></span><p> </div>");
            $('.off-canvas').animate({
                "margin-right": '+=25%'
            });
            $('i.fa.fa-times').animate({
                "margin-right": '+=25%'
            });
        }
    }
}
