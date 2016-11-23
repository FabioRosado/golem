var unsavedChanges = false;

var selectors = [
    'id',
    'name',
    'text',
    'link_text',
    'partial_link_text',
    'css',
    'xpath',
    'tag_name',];

$(document).ready(function() {      

    startAllSelectorInputAutocomplete();

    $(".element-name").keyup(function(){
        $(this).parent().parent().parent().find('.element-display-name').val($(this).val());
    });

    // set unsaved changes watcher
    watchForUnsavedChanges();
});



function startAllSelectorInputAutocomplete(){
    var lookup = []

    for(sel in selectors){
        lookup.push({
            'value': selectors[sel],
            'data': selectors[sel]
        })        
    }

    $(".element-selector").each(function(){

        autocomplete = $(this).autocomplete({
            lookup: lookup,
            minChars: 0,
            onSelect: function (suggestion) {
                //stepFirstInputChange($(this));
            },
            onSearchStart: function () {},
            beforeRender: function (container) {},
            onSearchComplete: function (query, suggestions) {
            }
        });
    })

}

function addPageObjectInput(){
    $("#elements").append(
        "<div class='element col-md-12'> \
            <div class='col-sm-3'> \
                <div class='input-group'> \
                    <input type='text' class='form-control element-name' value='' \
                        placeholder='name'> \
                </div> \
            </div> \
            <div class='col-sm-3'> \
                <div class='input-group'> \
                    <input type='text' class='form-control element-selector' \
                        value='' placeholder='selector'> \
                </div> \
            </div> \
            <div class='col-sm-3'> \
                <div class='input-group'> \
                    <input type='text' class='form-control element-value' \
                        value='' placeholder='value'> \
                </div> \
            </div> \
            <div class='col-sm-3'> \
                <div class='input-group'> \
                    <input type='text' class='form-control element-display-name' \
                        value='' placeholder='display name'> \
                </div> \
            </div> \
        </div>");

    // give focus to the last input
    $("#elements>div").last().find("input").first().focus();

    startAllSelectorInputAutocomplete();

    $(".element-name").keyup(function(){
        $(this).parent().parent().parent().find('.element-display-name').val($(this).val());
    });

    $("#elements input").on("change", function(){
        unsavedChanges = true;
    });
}


function savePageObject(){

    var elements = [];

    $(".element").each(function(){
        elements.push({
            'name': $(this).find('.element-name').val(),
            'selector': $(this).find('.element-selector').val(),
            'value': $(this).find('.element-value').val(),
            'display_name': $(this).find('.element-display-name').val()
        });
    });

    var functions = []

    $(".function").each(function(){
        functions.push($(this).find('.func-code').val());
    });


    $.ajax({
        url: "/save_page_object/",
        data: JSON.stringify({
                "project": project,
                "pageObjectName": pageObjectName,
                "elements": elements,
                "functions": functions
            }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: function(data) {
            toastr.options = {
                "positionClass": "toast-top-center",
                "timeOut": "3000",
                "hideDuration": "100"}
            toastr.success("Page "+pageObjectName+" saved");

            unsavedChanges = false;
        },
        error: function() {
        }
    });
}


function watchForUnsavedChanges(){
    $("input").on("change keyup paste", function(){
        unsavedChanges = true;
    });

    window.addEventListener("beforeunload", function (e) {
        if(unsavedChanges){
            var confirmationMessage = 'There are unsaved changes';
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }
    });
}