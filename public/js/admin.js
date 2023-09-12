async function listEvents() {
    //let signedInUser = JSON.parse( window.sessionStorage.getItem( "signedInUser" ) );
    //if ( signedInUser == null ) {
    //    window.location.href = "signin.html";
    //}
    //else {

    //console.log( "Loading Event History" );

    eventsTable = document.getElementById( "admineventstable" );

    let eventCollectionArray = null;

    return await fetch( "/events", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        //console.log( response );
        return response.json();
    } ).then( ( json ) => {
        //console.log( json );


        eventCollectionArray = json;

        //console.log( eventCollectionArray );


        //let filteredOrderCollection = Object.values( orderCollection ).filter( orderObj => orderObj.userId == signedInUser[ "id" ] );

        let filteredEventsCollection = Object.values( eventCollectionArray );

        //console.log( filteredEventsCollection );

        if ( filteredEventsCollection.length == 0 ) {
            console.log( "Filtered Events is Empty" );
            document.getElementById( "admineventhistory" ).innerHTML = "<tr><td><h3>No events found</h3></td></tr>";
            eventsTable.innerHTML = "";
        }
        else {
            Object.entries( filteredEventsCollection ).forEach( eventObj => {
                var tableRow = document.createElement( "tr" );
                eventsTable.appendChild( tableRow );
                var eventValues = eventObj[ 1 ];
                //console.log( encodeURIComponent( eventValues[ "_id" ] ) );
                var eventText = '<td>' + eventValues[ "id" ] + '</td>' +
                    '<td>' + eventValues[ "name" ] + '</td>' +
                    '<td>' + new Date( eventValues[ "eventDate" ] ) + '</td>' +
                    `<td><button class="btn btn-primary" id="${ eventValues[ "id" ] }" ` +
                    `onclick="editEventDetails(this.id);">Edit Event</button><br><button class="btn btn-primary" id="${ eventValues[ "id" ] }" ` +
                    `onclick="disableEventDetails(this.id);">Disable Event</button><br><button class="btn btn-primary" id="${ eventValues[ "id" ] }" ` +
                    `onclick="moderateEventDetails(this.id);">Moderate Event</button></td>`

                tableRow.innerHTML += eventText;
            } );
        }
    } ).catch( ( error ) => {
        console.log( error.message );
        document.getElementById( "admineventhistory" ).innerHTML = "<tr><td><h3>No events found</h3></td></tr>";
        eventsTable.innerHTML = "";
    } );
};

async function addEvent() {
    // get the values from the form
    let eventName = document.getElementById( "eventname" ).value;
    //console.log( eventName );
    let eventDate = document.getElementById( "eventdate" ).value;
    //console.log( eventDate );

    // create the event object
    let event = {
        "name": eventName,
        "eventDate": eventDate,
        "questions": []
    };

    //console.log( event );

    // THIS IS BROKEN

    // send the event object to the server
    return await fetch( "/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( event ),
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        console.log( "Am I getting here?" );
        console.log( response );

        // TODO - I need to figure out how to get the event ID from the response

        if ( response.status == 200 ) {
            console.log( "Where do I go next?" );
            window.location.href = "/admin";
        }
    }
    ).catch( ( error ) => {
        console.log( error.message );
    }
    );

}