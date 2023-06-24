/*   File: script.js
     GUI Assignment: JQ UI
     Author: Benjamin Jancsy
     Created: June 22, 2023
     Dynamically creates a custom multiplication table, validating user input and diplaying
     helpful error messages using JQ validation/ Includes useful UI features such as JQ UI slider.
     Tabs can be saved and deleted individually, just click on the desired tab then click delete.
     Works perfectly. Unbreakable (I think). Does EVERYTHING from assignment specs.
     Copyright (c) 2023 by Ben.
     References: w3schools.com, jqueryvalidation.org, jqueryui.com, developer.mozilla.org
*/
$().ready(function() {

    $("#slider1").slider({ // JQ UI Slider, actively updates table
        range: true,
        max: 999,
        min: -999,
        values: [-50,50],
        animate: "fast",
        slide: function(event, ui) {
            $("#lowcol").val(ui.values[0]);//update inputs
            $("#highcol").val(ui.values[1]);
            tableCaller(false);
        }
    });

    $("#slider2").slider({// JQ UI Slider, actively updates table
        range: true,
        max: 999,
        min: -999,
        values: [-50,50],
        animate: "fast",
        slide: function( event, ui ) {
            $("#lowrow").val(ui.values[0]);//update input fields
            $("#highrow").val(ui.values[1]);
            tableCaller(false);
        }
    });

    $("#lowcol").val($("#slider1").slider("values", 0));// initializes input boxes on pageload
    $("#highcol").val($("#slider1").slider("values", 1));
    $("#lowrow").val($("#slider2").slider("values", 0));
    $("#highrow").val($("#slider2").slider("values", 1));

    jQuery.validator.addMethod("greq", function( value, element, param) { //second # must be bigger than first
        // Bind to the blur event of the target in order to revalidate whenever the target field is updated
        var target = $( param ); // my source of this code was editing jqvalidator source code's "equalTo" method!!!
            if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
            target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
                $( element ).valid();
            } );
        }
        return Number(value) >= Number(target.val());
    });

    jQuery.validator.addMethod("nondecimal", function(value, element) {
        return /^-?[0-9]+$/.test(value); // regex since digit wouldnt allow negative numbers
    });

    jQuery.validator.addMethod("size", function( value, element) { //lets check for size limit even on some empty inputs
        var a = Number($("#lowcol").val());
        var b = Number($("#highcol").val());
        var c = Number($("#lowrow").val());
        var d = Number($("#highrow").val());
        if (isNaN(a)) {
            a = 1;
        }
        if (isNaN(b)) {
            b = 1;
        }
        if (isNaN(c)) {
            c = 1;
        }
        if (isNaN(d)) {
            d = 1;
        }
        return ((b - a + 1) * (d - c + 1) <= 20000); // Limits the table size to 20k cells.
    });

    var validator = $("#form").validate({ // straightfoward jq validation
        rules: {
            lowcol: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999, 999],
            },
            highcol: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999, 999],
                greq: "#lowcol",
                size: true
            },
            lowrow: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999, 999],
            },
            highrow: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999, 999],
                greq: "#lowrow",
                size: true
            },
        },
        messages: {
            lowcol: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "Range [-999,999]!",
            },
            highcol: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "Range [-999,999]!",
                greq: "Must be >= the left value!",
                size: "Table size! (max 20k cells)."
            },
            lowrow: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "Range [-999,999]!",
            },
            highrow: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "Range [-999,999]!",
                greq: "Must be >= the left value!",
                size: "Table size! (max 20k cells)."
            },
        }
    });

    $('#lowcol, #highcol, #lowrow, #highrow').on('change', function() { // change input? update table
        if($("#lowcol").val() && $("#highcol").val() && $("#lowrow").val() && $("#highrow").val()) {
            tableCaller(false);
        }
    });

    $("#lowcol, #highcol").on("keyup", function() { //sync slider on input change
        $("#slider1").slider("values", [$("#lowcol").val(), $("#highcol").val()]);
    });

    $("#lowrow, #highrow").on("keyup", function() { //sync slider on input change
        $("#slider2").slider("values", [$("#lowrow").val(), $("#highrow").val()]);
    });

    function tableCaller(saveTrue) { //only calls make when valid. saveTrue prevents constant new tabs
        if($('#form').valid()) {
            var ranges = document.getElementsByClassName("ranges"); // the values
            var a = Number(ranges[0].value.trim());
            var b = Number(ranges[1].value.trim());
            var c = Number(ranges[2].value.trim());
            var d = Number(ranges[3].value.trim());
            makeTable(a, b, c, d, saveTrue);
        }
    }

    var tabNum = 0; //keeps track of tables
    tableCaller(true); // on startup

    function makeTable(a, b, c, d, saveTrue) { // Where the table is made
        var data = [];
        var row = [];
        var rowhead = [];
        var colhead = [];
        rowhead.push('X'); // top left element
        for (var i = a; i <= b; i++) { // horizontal table head
            rowhead.push(i);
        }
        for (var i = c; i <= d; i++) { // vertical table head
            colhead.push(i);
        }
        for (var x = c; x <= d; x++) { // the 2d array of the entire table
            for (var y = a; y <= b; y++) {
                row.push(x * y);
            }
            data.push(row);
            row = [];
        }
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        rowhead.forEach((head) => { // pushes the header row onto the table
            let th = document.createElement('th');
            th.textContent = head; // make it a th element not just text
            thead.appendChild(th); // put the data onto the head row
        });
        table.appendChild(thead); // attaches it
        data.forEach((row_data) => { // for every row of data array (not header)
            let row = document.createElement('tr');
            let chead = document.createElement('th'); // the header of each row
            chead.textContent = colhead.shift(); //pop the front element for the vertical head
            row.appendChild(chead); //attaches
            row_data.forEach((cell_data) => { //for each cell of the row...
                let cell = document.createElement('td'); // element is a td
                cell.textContent = cell_data; //data
                row.appendChild(cell); // attach to the row
            });
            table.appendChild(row);//attach to table
        });
        if (saveTrue === true) { //only save when param says so
            tabNum = tabNum + 1;
            $("#tabs").tabs();
            var tableLi = $('<li><a href="#table-' + tabNum + '">' + tabNum + '</a></li>');
            $("#list").append(tableLi);
            $("#tabs").append($("<div class='tablediv' id='table-" + tabNum + "'></div>"));
            saveTrue = false;
        }
        $("#table-" + tabNum).empty();//allows append without removing div
        $("#table-" + tabNum).append(table);
        $("#tabs").tabs("refresh");
        $("#tabs").tabs("option", "active", $("ul li").length-1);//not actually needed, default behavior
    }

    $("#reset").click(function() {//deletes all tabs
        validator.resetForm();
        window.location.reload(1);
    });

    document.getElementById("clear").addEventListener("click", () => { // Clear the selected table only
        var active = $("#tabs").tabs("option", "active");//tab num
        var tabId = $("ul li:nth-child(" + (active + 1) + ") a").attr('href');//get the <a> id. NOT in li
        $(tabId).remove();//div element
        $("ul li:nth-child(" + (active + 1) + ")").remove();//delete list element
        $("#tabs").tabs("refresh");
    });

    document.getElementById("submit").addEventListener("click", function(){tableCaller(true)});//save table!

});
