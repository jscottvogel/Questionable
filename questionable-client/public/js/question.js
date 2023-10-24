async function loadQuestionInfo() {
    let questionInfoTable = document.getElementById( "questioninfotable" );

    questionInfoTable.innerHTML = "";

    let eventId = window.location.href.split( "=" )[ 1 ];

    //console.log( "Creating new question for Event Id: " + eventId );

    await fetch( `/event/${ eventId }`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        return response.json();
    } ).then( ( json ) => {
        //console.log( json );

        let eventInfo = json;

        //console.log( eventInfo );

        if ( eventInfo != null || eventInfo != undefined ) {
            var eventIdText = '<tr><td>Event ID: </td><td>' + eventInfo[ 0 ][ "id" ] + '</td><td colspan="2"></td></tr>';

            var eventNameText = '<tr><td>Event Name: </td><td>' + eventInfo[ 0 ][ "name" ] + '</td><td colspan="2"></td></tr>';

            var eventDateText = '<tr><td>Event Date: </td><td>' + new Date( eventInfo[ 0 ][ "eventDate" ] ) + '</td><td colspan="2"></td></tr>';

            questionInfoTable.innerHTML += eventIdText + eventNameText + eventDateText;

        } else {
            questionInfoTable.innerHTML = "<tr><td>Could not load event info</td></tr>";
        }
    } ).catch( ( error ) => {
        console.log( error );
        questionInfoTable.innerHTML = "<tr><td>Could not load event info</td></tr>";
    } );
}

async function submitNewQuestion() {
    let question = document.getElementById( "question" ).value;

    let eventId = window.location.href.split( "=" )[ 1 ];

    let eventInfo = [];
    //console.log( "Creating new question for Event Id: " + eventId );

    await fetch( `/event/${ eventId }`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        return response.json();
    } ).then( ( json ) => {
        //console.log( json );

        eventInfo = json;

        //console.log( eventInfo[ 0 ] );

        // add the new question to the event
        eventInfo[ 0 ].questions.push( { "question": question, "ranking": 0 } );

        //console.log( eventInfo[ 0 ] );

        // update the event
        return fetch( `/event/${ eventId }/question`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { "question": question, "ranking": 0 } ),
            cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
        } )
    } ).then( ( response ) => {
        console.log( response );

        // reload the page
        viewEventDetails( eventInfo[ 0 ].id );
    } ).catch( ( error ) => {
        console.log( error );
    } );
};

function viewEventDetails( eventId ) {
    console.log( "View Event Detail: " + eventId );
    //window.location.href = "view_eventdetail.html?id=" + "64dc1d9b06a96073dfb2ed15";
    window.location.href = "view_eventdetail.html?id=" + eventId;
};

