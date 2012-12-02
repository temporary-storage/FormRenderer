
var functionList //= loadXMLFunctionList();
// only array for autocomplete
var functionListAutocomplete;
var functionListFullJSON;

/**
 * closure to get code for naming purposes
 * @param str
 * @return {Number}
 */
var hashCode = function(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function convertToAutocomplete(functionListFullJSON){
    var functionListAutocompleteJSON = new Array();
    $(functionListFullJSON.item).each(function(i){
        functionListAutocompleteJSON.push(this.title)
    })

    return functionListAutocompleteJSON;
}
function defineAutocomplete(){

    $( "#FucntionsInput").autocomplete({
        source: functionListAutocomplete,
        minLength : 3,
        select: function( event, ui ) {
            console.log(ui.item.value);

            item = getDataByValue(ui.item.value)
            console.log ('final function item '+item);

            firePopup(renderTemplate(item),item);
        }
    });
}
function getDataByValue(value){
    //console.log(functionListFullJSON)
    var result;
    $(functionListFullJSON.item).each(function(i){

        console.log (this.title +" "+value)
        if (this.title === value) {
            result = this;
        }
    })
    return result;
}
function renderTemplate(item){
    function wrapNode(node){
        return "<div class='NodeBlock'>"+node+"</div>";
    }
    var container = '';
    var rules = '';
    var node ='';
    console.log('arguments:');
    console.log(item.arguments.argument);

    // iterating through argument list
    $(item.arguments.argument).each(function(i){
        node = '';

        switch (this.containerType) {

            case "input":

                node = this.title+": <input type='text' placeholder='"+this.placeholder+"' class='"+this.rules+" "+this.class+"' name='"+this.title+"'  id='"+this.title+"'>\n";


                var addition_ability = '';
                if ( this.addition_ability === 'true'){
                    node += "<input type='button' class='AddInputField' value='Добавить'>";
                }
                container +=wrapNode(node);
                break;

            case "select":
                node += this.title+": <select class='"+this.rules+"' name='"+this.title+"'    id='"+this.title+"'>\n";
                var optionArray = this.predefinedValues.split(";");
                $(optionArray).each(function(t){
                    node += "<option value='"+this+"'>"+this+"</option>"
                })

                node += "</select>";
                container +=wrapNode(node);
                break;
            case "checkbox":

                var optionArray = this.predefinedValues.split(";");
                var idAddition = 0;
                rules = this.rules;
                $(optionArray).each(function(t){
                    node = this+": <input type='checkbox' class='"+rules+"' name='"+this+"'    id='"+this+idAddition+"'>\n";
                    container +=wrapNode(node);
                    idAddition++;
                })

                break;
            case "radio":

                var optionArray = this.predefinedValues.split(";");
                var name = "RadioGroup_"+hashCode(this.title);
                rules = this.rules;
                $(optionArray).each(function(t){
                    node = this+": <input type='radio' class='"+rules+"' name='"+name+"' value='"+this+"'    id='"+this+"'>\n";
                    container +=wrapNode(node);

                })
                break;
        }

    })

    return container;
}
function firePopup(plainHTML,item){
    //clear dialog box
    $("#FunctionDescription").html('');
    $("#FunctionForm").html('');

    // fill dialog box with function data
    $("#FunctionDescription").html(item.description);
    $( "#FunctionContainer" ).attr('title',item.title);
    $("#FunctionForm").append(plainHTML);
    $("#FunctionForm").append('<input type="submit" value="получить функцию">');
    $( "#FunctionContainer" ).dialog({
        minHeight: 500,
        width:800,
        modal: true
    });
    $('.AddInputField').live('click',function(e){
        e.preventDefault();
        console.log("parent container: ")
        var parentContainer = $(this).parent();

        $(this).parent().after( $(this).parent().clone() );
        $(this).parent().find('input[type="button"]').remove();
    })

    $(function() {
        $( ".DateInput" ).datepicker( );
        
        $( ".DateInputRange" ).daterangepicker({
            posX: 0,
            posY: 0,
            presetRanges: [
                {text: 'Выберите промежуток', dateStart: 'Today', dateEnd: 'Today+30' }
            ],
            presets: {
                dateRange: 'Date Range'
            }
        });

    });


    $("#FunctionForm").validationEngine({
        validationEventTrigger : '' // prevent firing prompt on blur at dailog fire
        //promptPosition : 'inline'
    });


}
/**
 * @method loadXMLFunctionList loading xml with initing global function list var
 * @return {Array} functionList list of all function s with params
 */
/*
function loadXMLFunctionList(){
    var functionList = null;
    return functionList;
}*/
function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
        try {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        catch (e) { dom = null; }
    }
    else if (window.ActiveXObject) {
        try {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml)) // parse error ..

                window.alert(dom.parseError.reason + dom.parseError.srcText);
        }
        catch (e) { dom = null; }
    }
    else
        alert("cannot parse xml string!");
    return dom;
}



$(document).load("./storage/functions.xml", function(response, status, xhr) {
    if (xhr.status == 200)
    {
    //    console.log(response)
        functionList = response;
        console.log(functionList);

        var dom = parseXml(functionList),
            json = functionListFullJSON = $.xml2json(dom);
        console.log(json.item[0].title)
        console.log(functionListAutocomplete = convertToAutocomplete(json));

        defineAutocomplete();
        //console.log(json[0]["functions"][0])

/*
        var dom1 = parseXml("<?xml version='1.0'?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>")
        console.log(xml2json(dom1))*/
        //console.log(json[0].functions.item[0].title)

    }
    else
    {
        throw new FileNotFoundError("xml document is empty");
    }

});

