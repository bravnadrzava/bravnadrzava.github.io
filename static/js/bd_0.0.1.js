function add_element_to_panel( elem, panel ) {
    var pnl = document.querySelector( panel );
    pnl.appendChild( elem );
}


function make_panel_subtitle( subtitle ) {

    // Test to see if the browser supports the HTML template element by checking
    // for the presence of the template element's content attribute.
    if ( "content" in document.createElement( "template" ) ) {
	var template = document.querySelector( "#panel_subtitle" );
	var clone = document.importNode( template.content, true );
	var h5 = clone.querySelectorAll( "h5" );
	h5[0].textContent = subtitle;
	return clone
    } else {
	// TODO
	alert( "Your browser is incompatible with the content of this site." )
    }
}


function make_panel_list( section, json ) {

    // Test to see if the browser supports the HTML template element by checking
    // for the presence of the template element's content attribute.
    if ( "content" in document.createElement( "template" ) ) {
	var template = document.querySelector( "#panel_list" )
	var clone = document.importNode( template.content, true )
	var title = clone.querySelectorAll( "#list_title" )
	title[0].innerHTML = json[section]["title"]
	var items = clone.querySelectorAll( "#list_items" )[0]
	for( var i = 0; i < json[section]["list"].length; i++ ) {
	    var item = json[section]["list"][i]
	    var li = document.createElement( "a" )
	    var a = document.createElement( "a" )
	    // li.setAttribute( "class", "list-group-item" )
	    a.setAttribute( "href", item["href"] )
	    // var att = document.createAttribute( "href" )
	    // att.setAttribute = item["href"]
	    // var br = document.createElement( "br" )
	    a.innerHTML = item["title"]
	    li.appendChild( a )
	    items.appendChild( li )
	    // items.appendChild( br )
	}
	return clone
    } else {
	// TODO
	alert( "Your browser is incompatible with the content of this site." )
    }
}


// returns a random index from 0 to len
function get_random_integer( len ) { 
    // See also the random API: http://www.random.org/clients/http/
    return Math.floor( Math.random() * len )
}


function read_json( url ) {
    var json_text = $.ajax( { url: url, async: false } ).responseText;
    var json = JSON.parse( json_text )
    return json
}


// Fisher-Yates shuffle; Taken from: Fisher-Yates shuffle
function shuffle( array ) {
    for( var i = array.length - 1; i > 0; i-- ) {
	var j = get_random_integer( array.length )
	[ array[i], array[j] ] = [ array[j], array[i] ]
    }
}


function make_shuffled_weighted_indexes( json ) {
    var arr = []
    for( i = 0; i < json.banners.length; i++ )
	for( j = 0; j < json.banners[i].weight; j++ )
    	    arr.push( i )
    shuffle( arr ) // Let's do it again, to improve randomness:
    shuffle( arr )
    shuffle( arr )
    return arr
}


function remove_index( arr, index ) {
    for( var i = 0; i < arr.length; i++ ) {
	if ( arr[i] == index) {
	    arr.splice(i, 1);
	    i--;
	}
    }
}


function get_or_load_html_template( template ) {
    if( loaded_templates.hasOwnProperty( template ) ) {
	return loaded_templates[ template ]
    }
    var loaded = $.ajax( { url: template, async: false } ).responseText
    loaded_templates[ template ] = loaded
    return loaded
}


/*
function get_external() {

    try {
	var data =  get_or_load_html_template( "/static/js/templates/primo_piano_it.html" )
	var div = document.createElement( "div" )
	$( div ).html( data )
	return div
    }
    catch(err) {
	alert( err.message )
    }
}
//*/


function make_banner( json, weighted_indexes ) {

    try {
	var index
	var banner
	var label

	// Skip banners for the current page
	do {
	    index = weighted_indexes[ get_random_integer( weighted_indexes.length ) ]
	    banner = json.banners[ index ]
	    label = json.buttons[ "go_to_page" ]
	    remove_index( weighted_indexes, index )
	    var page_logo = document.getElementById("page_logo")
	    var banner_logo = banner["img"]
	} while( !( page_logo === undefined || page_logo === null ) && page_logo.src.endsWith( banner_logo ) )
	
	var data = get_or_load_html_template( "/static/js/templates/aforizam.html" )
	data = data.
	    replace( "{{ TITLE }}", banner["title"] ).
	    replace( "{{ ALT }}", banner["alt"] ).
	    replace( "{{ IMG }}", banner["img"] ).
	    replace( "{{ HREF }}", banner["href"] ).
	    replace( "{{ DESCRIPTION }}", banner["description"] ).
	    replace( "{{ GO-TO-PAGE }}", label )

	var div = document.createElement( "div" );
	$( div ).html( data );
	return div
    }
    catch(err) {
	alert( err.message )
    }
}


function make_panel_1( json_banners, json_recommended, wi ) {
    var panel = "#panel_1"
    var elem
    // elem = make_panel_subtitle( json_recommended["new_pages"]["title"] )
    elem = make_panel_subtitle( "Najnovije" )
    add_element_to_panel( elem, panel )
    elem = make_panel_list( "new_pages", json_recommended )
    add_element_to_panel( elem, panel )
    elem = make_panel_list( "modified_pages", json_recommended )
    add_element_to_panel( elem, panel )

    elem = make_banner( json_banners, wi )
    add_element_to_panel( elem, panel )
}


function make_panel_2( json_banners, json_recommended, wi ) {
    var panel = "#panel_2"
    var elem
    elem = make_panel_subtitle( "U prvom planu" )
    add_element_to_panel( elem, panel )
    elem = make_panel_list( "most_read", json_recommended )
    add_element_to_panel( elem, panel )
    elem = make_panel_list( "suggested", json_recommended )
    add_element_to_panel( elem, panel )
}


function main() {
    var json_banners = read_json( "/static/json/aforizmi.json" )
    var wi = make_shuffled_weighted_indexes( json_banners )
    var json_recommended = read_json( "/static/json/recommended_pages.json" )
    
    make_panel_1( json_banners, json_recommended, wi )
    make_panel_2( json_banners, json_recommended, wi )
}


var loaded_templates = {}
var l10n 
var lang

main()


