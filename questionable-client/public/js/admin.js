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
                    `onclick="loadEditEventPage(this.id);">Edit Event</button><br><button class="btn btn-primary" id="${ eventValues[ "id" ] }" ` +
                    `onclick="loadModerateEventPage(this.id);">Moderate Event</button><br><button class="btn btn-primary" id="${ eventValues[ "id" ] }" ` +
                    `onclick="deleteEvent(this.id);">Delete Event</button></td>`

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

    // send the event object to the server
    return await fetch( "/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( event ),
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        //console.log( "Am I getting here?" );
        //console.log( response );

        if ( response.status == 200 ) {
            //console.log( "Where do I go next?" );
            window.location.href = "/admin";
        }
    }
    ).catch( ( error ) => {
        console.log( error.message );
    }
    );

}

async function updateEvent() {
    // get the values from the form
    let eventId = document.getElementById( "eventid" ).value;
    //console.log( eventId );
    let eventName = document.getElementById( "eventname" ).value;
    //console.log( eventName );
    let eventDate = document.getElementById( "eventdate" ).value;
    //console.log( eventDate );

    // create the event object
    let event = {
        "id": eventId,
        "name": eventName,
        "eventDate": eventDate,
    };

    //console.log( event );

    // send the event object to the server
    return await fetch( "/event", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( event ),
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        //console.log( "Am I getting here?" );
        //console.log( response );

        if ( response.status == 200 ) {
            //console.log( "Where do I go next?" );
            window.location.href = "/admin";
        }
    }
    ).catch( ( error ) => {
        console.log( error.message );
    }
    );

}

async function deleteEvent( eventId ) {
    // send the event object to the server
    return await fetch( `/event/${ eventId }`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        //console.log( "Am I getting here?" );
        //console.log( response );

        if ( response.status == 200 ) {
            //console.log( "Where do I go next?" );
            window.location.href = "/admin";
        }
    }
    ).catch( ( error ) => {
        console.log( error.message );
    }
    );

}

function loadEditEventPage( eventId ) {
    //console.log( "View Event Detail: " + evId );
    //window.location.href = "view_eventdetail.html?id=" + "64dc1d9b06a96073dfb2ed15";
    window.location.href = "/admin/update?id=" + eventId;
};


async function loadEventForUpdate() {
    // get the event id from the query string
    let eventId = window.location.search.split( "=" )[ 1 ];
    //console.log( eventId );

    // get the event object from the server
    return await fetch( `/event/${ eventId }`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {

        return response.json();
    } ).then( ( json ) => {
        //console.log( json );

        // populate the form
        document.getElementById( "eventid" ).value = json[ 0 ][ "id" ];
        document.getElementById( "eventname" ).value = json[ 0 ][ "name" ];
        let evtDate = new Date( json[ 0 ][ "eventDate" ] );
        console.log( evtDate );
        console.log( evtDate.toISOString().substring( 0, 10 ) );
        document.getElementById( "eventdate" ).value = evtDate.toISOString().substring( 0, 10 );

    } ).catch( ( error ) => {
        console.log( error.message );
    } );

}

function loadModerateEventPage( eventId ) {
    //console.log( "View Event Detail: " + evId );
    //window.location.href = "view_eventdetail.html?id=" + "64dc1d9b06a96073dfb2ed15";
    window.location.href = "/admin/moderate?id=" + eventId;
};


async function loadEventDetailsForModeration() {
    // get the event id from the query string
    let eventId = window.location.search.split( "=" )[ 1 ];
    //console.log( eventId );

    // get the event object from the server
    return await fetch( `/event/${ eventId }`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {

        return response.json();
    } ).then( ( json ) => {
        //console.log( json );

        // populate the form
        displayEventDetailsForModeration( json );

        displayQuestionDetailsForModeration( json );

    } ).catch( ( error ) => {
        console.log( error.message );
    } );
};

function formatEventQuestionsForModeration( eDetails ) {
    let questions = eDetails[ "questions" ];
    let questionsText = '<tr><td colspan="3">Questions: <table><tr><th>Question</th><th >Ranking</th><th>Actions</th></tr>';

    //console.log( questionsText );

    if ( questions != null && questions != undefined && questions.length != 0 ) {
        let sortedQuestions = Object.values( questions ).sort( ( a, b ) => {
            return b.ranking - a.ranking;
        } );

        Object.entries( sortedQuestions ).forEach( questionObj => {
            //console.log( "Inside for each" );
            var questionValues = questionObj[ 1 ];
            //console.log( questionValues )

            questionsText +=
                '<tr>' +
                '<td>' + questionValues.question + '</td>' +
                '<td>' + questionValues.ranking + '</td>' +
                '<td>' + '<button class="btn btn-primary" id="' + questionValues.id + '" onclick="updateQuestion();">UpdateQuestion</button><br><button class="btn btn-primary" id="' + questionValues.id + '" onclick="deleteQuestion();">DeleteQuestion</button>' +
                '</td>' +
                '</tr>';
        } );

    } else {
        questionsText += '<tr><td>No questions found</td></tr>';
    }

    questionsText += '</table></td></tr>';

    //console.log( questionsText );

    return questionsText;
};

function displayEventDetailsForModeration( eventDetailCollectionArray ) {
    //console.log( eventDetailCollectionArray );
    //document.getElementById( "eventdetailtable" ).innerHTML = "";

    if ( eventDetailCollectionArray != null || eventDetailCollectionArray != undefined || eventDetailCollectionArray.length != 0 ) {
        //console.log( "Event Detail Collection is not Empty, so filtering" );

        //let filteredEventDetailCollection = Object.values( eventDetailCollection ).filter( orderDetailObj => {
        //console.log( "Order Detail Object: " + JSON.stringify( orderDetailObj ) );
        //    return orderDetailObj.userId == signedInUser[ "id" ]
        //} );

        let filteredEventDetailCollection = Object.values( eventDetailCollectionArray );

        if ( filteredEventDetailCollection.length == 0 ) {
            //console.log( "Filtered Events is Empty" );
            document.getElementById( "eventdetailtable" ).innerHTML = "<tr><td>No events found</td></tr>";
        }
        else {
            //console.log( "Filtered Events is not Empty, so we have at least 1 event" );

            //console.log( filteredEventDetailCollection );

            Object.entries( filteredEventDetailCollection ).forEach( eventDetailObj => {
                //console.log( "Event Detail Object: " + JSON.stringify( eventDetailObj ) );

                //console.log( "Looking for order id = " + window.location.href.split( "=" )[ 1 ] );

                if ( eventDetailObj[ 1 ][ "id" ] == window.location.href.split( "=" )[ 1 ] ) {
                    //console.log( "Found the event we are looking for" );

                    var eventDetailValues = eventDetailObj[ 1 ];
                    //console.log( eventDetailValues );

                    var eventIdText = '<tr><td>Event ID: </td><td>' + eventDetailValues[ "id" ] + '</td><td colspan="2"></td></tr>';

                    //console.log( eventIdText );

                    var eventNameText = '<tr><td>Event Name: </td><td>' + eventDetailValues[ "name" ] + '</td><td colspan="2"></td></tr>';

                    //console.log( eventNameText );

                    var eventDateText = '<tr><td>Event Date: </td><td>' + new Date( eventDetailValues[ "eventDate" ] ) + '</td><td colspan="2"></td></tr>';

                    //console.log( eventDateText );

                    document.getElementById( "eventdetailtable" ).innerHTML = eventIdText + eventNameText + eventDateText;
                }
            } );
        }
    }
};

function displayQuestionDetailsForModeration( eventDetailCollectionArray ) {
    //console.log( eventDetailCollectionArray );
    //document.getElementById( "eventdetailtable" ).innerHTML = "";

    if ( eventDetailCollectionArray != null || eventDetailCollectionArray != undefined || eventDetailCollectionArray.length != 0 ) {
        //console.log( "Event Detail Collection is not Empty, so filtering" );

        //let filteredEventDetailCollection = Object.values( eventDetailCollection ).filter( orderDetailObj => {
        //console.log( "Order Detail Object: " + JSON.stringify( orderDetailObj ) );
        //    return orderDetailObj.userId == signedInUser[ "id" ]
        //} );

        let filteredEventDetailCollection = Object.values( eventDetailCollectionArray );

        if ( filteredEventDetailCollection.length == 0 ) {
            //console.log( "Filtered Events is Empty" );
            document.getElementById( "questiondetailtable" ).innerHTML = "";
        }
        else {
            //console.log( "Filtered Events is not Empty, so we have at least 1 event" );

            //console.log( filteredEventDetailCollection );

            Object.entries( filteredEventDetailCollection ).forEach( eventDetailObj => {
                //console.log( "Event Detail Object: " + JSON.stringify( eventDetailObj ) );

                //console.log( "Looking for order id = " + window.location.href.split( "=" )[ 1 ] );

                if ( eventDetailObj[ 1 ][ "id" ] == window.location.href.split( "=" )[ 1 ] ) {
                    //console.log( "Found the event we are looking for" );

                    var eventDetailValues = eventDetailObj[ 1 ];
                    //console.log( eventDetailValues );

                    var eventQuestionsText = formatEventQuestionsForModeration( eventDetailValues );

                    document.getElementById( "questiondetailtable" ).innerHTML = eventQuestionsText;
                }
            } );
        }
    }
};

function adminAddQuestion() {
    alert( "Add Question" );
}

function updateQuestion( event ) {
    alert( "Update Question" );
}

function deleteQuestion( event ) {
    alert( "Delete Question" );
}
