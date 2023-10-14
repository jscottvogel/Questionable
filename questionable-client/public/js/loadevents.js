async function loadEventHistory() {
    //let signedInUser = JSON.parse( window.sessionStorage.getItem( "signedInUser" ) );
    //if ( signedInUser == null ) {
    //    window.location.href = "signin.html";
    //}
    //else {

    //console.log( "Loading Event History" );

    eventsTable = document.getElementById( "eventstable" );

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
            document.getElementById( "eventhistory" ).innerHTML = "<tr><td><h3>No events found</h3></td></tr>";
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
                    `onclick="viewEventDetails(this.id);">View Event Details</button></td>`

                tableRow.innerHTML += eventText;
            } );
        }
    } ).catch( ( error ) => {
        console.log( error.message );
        document.getElementById( "eventhistory" ).innerHTML = "<tr><td><h3>No events found</h3></td></tr>";
        eventsTable.innerHTML = "";
    } );
};

function viewEventDetails( evId ) {
    //console.log( "View Event Detail: " + evId );
    //window.location.href = "view_eventdetail.html?id=" + "64dc1d9b06a96073dfb2ed15";
    window.location.href = "view_eventdetail.html?id=" + evId;
};

async function loadEventDetail() {
    // check for signed in user
    //    let signedInUser = JSON.parse( window.sessionStorage.getItem( "signedInUser" ) );
    //    if ( signedInUser == null ) {
    //        window.location.href = "signin.html";
    //    }
    //    else {
    //console.log( "User Signed In: " + signedInUser[ "id" ] );

    //console.log( "Loading Event Details" );

    let eventDetailCollectionArray = {};

    return await fetch( "/events", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        //console.log( response );
        return response.json();
    } ).then( ( json ) => {
        //console.log( json );

        eventDetailCollectionArray = json;

        //console.log( eventDetailCollectionArray );

        displayEventDetails( eventDetailCollectionArray );

        displayQuestionDetails( eventDetailCollectionArray );

    } ).catch( ( error ) => {
        console.log( error.message );
        document.getElementById( "eventdetailtable" ).innerHTML = "<tr><td>No events found</td></tr>";
    } );
};

function formatEventQuestions( eDetails ) {
    let questions = eDetails[ "questions" ];
    let questionsText = '<tr><td colspan="4">Questions: <table><tr><th>Question</th><th >Ranking</th><th></th><th ></th></tr>';

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
                '<td>' +
                `<a id="${ questionValues.qid }" onclick="event.preventDefault();processLike(\'${ eDetails.id }\',\'${ questionValues.qid }\', '${ questionValues.ranking }');"><img src="../img/DALL·E 2023-08-13 17.31.33 - like icon.png"></a>` +
                '</td>' +
                '<td>' +
                `<a id="${ questionValues.qid }" onclick="event.preventDefault();processDislike(\'${ eDetails.id }\',\'${ questionValues.qid }\', '${ questionValues.ranking }');"><img src="../img/DALL·E 2023-08-13 17.31.33 - dislike icon.png"></a>` +
                '</td>' +
                '</tr>';
        } );

    }

    questionsText += '</table></td></tr>';

    //console.log( questionsText );

    return questionsText;
};

async function processLike( eventId, questionId, rank ) {

    // check session storage to see if question already liked
    // if not, then process like
    // if yes, then do nothing
    let likedQuestions = JSON.parse( window.sessionStorage.getItem( "likedQuestions" ) );
    //console.log( likedQuestions );
    if ( likedQuestions == null ) {
        likedQuestions = { "likedQuestions": [] };
    }

    let alreadyLiked = likedQuestions[ "likedQuestions" ].includes( questionId );
    if ( !alreadyLiked ) {
        //console.log( "Question not liked yet" );
        //console.log( questionId );

        return await fetch( `/like`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { eId: eventId, qId: questionId } ),
            cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
        } ).then( ( response ) => {
            //console.log( response );
            return fetch( `/event/${ eventId }`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
            } );
        } ).then( ( response ) => {
            //console.log( response );
            return response.json();
        } ).then( ( json ) => {
            //console.log( json );

            let eventArray = [];
            eventArray.push( json );

            //console.log( eventArray );

            //HACK - need to fix this, something weird with timing of the fetch and the display
            adjustRanking( eventArray[ 0 ], questionId, rank, 1 );

            displayQuestionDetails( eventArray[ 0 ] );

            //console.log( "Like Processed:" + eventArray[ 0 ] );
            likedQuestions[ "likedQuestions" ].push( questionId );
            window.sessionStorage.setItem( "likedQuestions", JSON.stringify( likedQuestions ) );
        } ).catch( ( error ) => {
            console.log( error.message );
        }
        );
    } else {
        console.log( "Question already liked" );
    }
}

async function processDislike( eventId, questionId, rank ) {
    let dislikedQuestions = JSON.parse( window.sessionStorage.getItem( "dislikedQuestions" ) );
    //console.log( dislikedQuestions );
    if ( dislikedQuestions == null ) {
        dislikedQuestions = { "dislikedQuestions": [] };
    }

    let alreadyDisliked = dislikedQuestions[ "dislikedQuestions" ].includes( questionId );
    if ( !alreadyDisliked ) {

        return await fetch( `/dislike`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { eId: eventId, qId: questionId } ),
            cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
        } ).then( ( response ) => {
            //console.log( response );
            return fetch( `/event/${ eventId }`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
            } );
        } ).then( ( response ) => {
            console.log( response );
            return response.json();
        } ).then( ( json ) => {
            console.log( json );


            let eventArray = [];
            eventArray.push( json );

            //console.log( eventArray );
            adjustRanking( eventArray[ 0 ], questionId, rank, -1 );

            displayQuestionDetails( eventArray[ 0 ] );

            //console.log( "Dislike Processed" );
            dislikedQuestions[ "dislikedQuestions" ].push( questionId );
            window.sessionStorage.setItem( "dislikedQuestions", JSON.stringify( dislikedQuestions ) );
        } ).catch( ( error ) => {
            console.log( error.message );
        } );
    } else {
        console.log( "Question already disliked" );
    }
};

function displayEventDetails( eventDetailCollectionArray ) {
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

function displayQuestionDetails( eventDetailCollectionArray ) {
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

                    var eventQuestionsText = formatEventQuestions( eventDetailValues );

                    document.getElementById( "questiondetailtable" ).innerHTML = eventQuestionsText;
                }
            } );
        }
    }
};

function addQuestion() {
    window.location.href = `add_question.html?id=${ window.location.href.split( "=" )[ 1 ] }`;
};

function adjustRanking( event, questionId, rank, incr ) {
    // if the question in the return result has the same ranking as the one in the table, then increment the ranking

    //console.log( "Adjust Ranking" );
    //console.log( event );
    //console.log( questionId );
    //console.log( rank );

    let questions = event[ 0 ][ "questions" ];
    //console.log( questions );

    let index = questions.findIndex( ( q ) => {
        //console.log( q.qid );
        return ( q.qid === questionId );
    }
    );

    //console.log( index );

    //console.log( questions[ index ].ranking );

    if ( questions[ index ].ranking == rank ) {
        //console.log( "Ranking is the same" );
        //console.log( "Incrementing Ranking" );
        questions[ index ].ranking += incr;
    }
    else {
        //console.log( "Ranking is not the same" );
        //console.log( "Not Incrementing Ranking" );
    }

}