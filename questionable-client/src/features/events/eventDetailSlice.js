import { createSlice } from '@reduxjs/toolkit';
import { proxyHost, proxyPort } from '../../app/ProxyConfig';

const initialState = {};

const eventDetailSlice = createSlice( {
    name: 'currentEvent',
    initialState: {
        currentEvent: initialState
    },
    reducers: {
        loadEventDetail: ( state, action ) => {
            // check to see if there are any new events
            // if so, add them to the state
            // if not, do nothing
            if ( state.currentEvent === null || state.currentEvent === undefined ) {

                state.currentEvent = action.payload[ 0 ];
            } else {

                if ( state.currentEvent.id !== action.payload[ 0 ].id ) {
                    state.currentEvent = action.payload[ 0 ];
                }
            }
        },
        addQuestion: ( state, action ) => {
            // add the question to the event

            //console.log( "Adding question to event" );

            //debugger
            fetch( `${ proxyUrl }/event/${ state.currentEvent.id }/question`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { "qid": null, "question": action.payload, "ranking": 0, "approved": false } ),
                cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
            } ).then( response => response.json() )
                .then( ( temp ) => {
                    //debugger
                    return fetch( `${ proxyUrl }/event/${ state.currentEvent.id }`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    } );
                } ).then( res => {
                    let evt = res.json();
                    console.log( evt );
                    state.currentEvent = evt;
                } )
                .catch( ( error ) => {
                    console.log( error );
                } );
        },
        adjustQuestionRanking: ( state, action ) => {
            //console.log( action.payload );

            const { eventId, questionId, adjustment } = action.payload;
            //console.log( "Adjusting question ranking for event " + eventId + " and question " + questionId + " by " + adjustment );

            const event = state.currentEvent;

            if ( event.id === eventId ) {
                //console.log( "Event id matches" );

                const question = event.questions.find( q => q.qid === questionId );

                //console.log( "Adjusting question for question " + JSON.stringify( question ) );
                //console.log( "Adjusting question ranking " + adjustment );

                question.ranking += adjustment;

                //console.log( "Question ranking is now " + question.ranking );

                // sort the questions by ranking
                event.questions.sort( ( a, b ) => {
                    if ( a.ranking < b.ranking ) {
                        return 1;
                    } else if ( a.ranking > b.ranking ) {
                        return -1;
                    } else {
                        return 0;
                    }
                } );

                // update the state
                //console.log( "Updating state" );
                state.currentEvent = event;
            }
        },
        updateEvent: ( state, action ) => {
            //console.log( "updateEvent reducer" );

            let modifiedEvent = {};
            modifiedEvent.id = action.payload.id;
            modifiedEvent.name = action.payload.name;
            modifiedEvent.eventDate = action.payload.eventDate;

            let newState = state.currentEvent;

            //console.log( newState );

            newState.id = modifiedEvent.id;
            newState.name = modifiedEvent.name;
            newState.eventDate = modifiedEvent.eventDate;

            //console.log( "Modified new state = " + newState );

            state.currentEvent = newState;
        },
        updateQuestionApproved: ( state, action ) => {
            //console.log( "Approve Question" );
            //console.log( action.payload );

            const { eventId, questionId, approvedVal } = action.payload;

            const event = state.currentEvent;

            if ( event.id === eventId ) {
                //console.log( "Event id matches" );

                const question = event.questions.find( q => q.qid === questionId );

                //console.log( "Approving question for question " + JSON.stringify( question ) );

                // /event/:id/question/:qid/approved

                question.approved = approvedVal;

                //console.log( "Question approved" );

                // update the state
                //console.log( "Updating state" );
                state.currentEvent = event;
            }
        },
        deleteQuestion: ( state, action ) => {
        }
    }
} );

const fetchEventDetail = ( dispatch, getState, id ) => {
    //console.log( "Fetching event detail for event " + id );
    // Make an async HTTP request
    return fetch( `${ proxyUrl }/event/${ id }`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( res => { const evts = res.json(); return evts; } )
        .then( evts => {
            dispatch( { type: "currentEvent/loadEventDetail", payload: evts } );
        } ).catch( err => console.log( err ) );
    // todo, error condition
}

const processAdjustment = ( eventId, questionId, adjustment, dispatch ) => {
    //console.log( "Making Adjustment: " + adjustment );
    return fetch( `${ proxyUrl }/event/${ eventId }/question/${ questionId }/ranking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( { "adjustment": adjustment } ),
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( ( response ) => {
        // cehck to see if the response is ok
        if ( !response.ok ) {
            throw new Error( "HTTP error, status = " + response.status );
        }

        // otherwise, update the state
        //console.log( "Adjustment value is " + adjustment );
        dispatch( { type: "currentEvent/adjustQuestionRanking", payload: { "eventId": eventId, "questionId": questionId, "adjustment": adjustment } } );
    } ).catch( ( error ) => {
        console.log( error );
    }
    );
}

const modifyEvent = ( updatedEvent, dispatch ) => {
    return fetch( `${ proxyUrl }/event`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        body: JSON.stringify( updatedEvent )
    } )
        .then( response => {
            if ( response.ok ) {

                console.log( "Event updated, dispatching updateEvent action" );

                dispatch( { type: "currentEvent/updateEvent", payload: { "id": updatedEvent.eventId, "name": updatedEvent.eventName, "eventDate": updatedEvent.eventDate } } );

            } else {
                //console.log( response );
                console.log( "Event not updated" );
                return null;
            }
        } )
        .catch( error => {
            console.log( error );
            return null;
        } );
}

function processAddQuestion( event, dispatch ) {
    //console.log( "Add Question" );
    //console.log( event );

    if ( event !== null && event !== undefined ) {

        if ( event.keyCode === 13 || event.which === 13 ) {

            let newQuestion = event.target.value;

            // todo: add question to the event
            // set the ranking to 0
            // add the question to the state
            // clear the input field
            event.target.value = "Enter question";

            //console.log( "Adding question: " + newQuestion );
            //debugger
            dispatch( { type: "currentEvent/addQuestion", payload: newQuestion } );
        }
    }
}


function stringToDate( dateString ) {
    //console.log( "stringToDate() dateString: " + dateString );
    if ( dateString === null || dateString === undefined ) {
        return new Date();
    }

    var parts = dateString.split( '-' )
    let dt = new Date();
    dt.setFullYear( parts[ 0 ] );
    dt.setMonth( parts[ 1 ] - 1 );
    dt.setDate( parts[ 2 ] );
    //console.log( dt );
    return dt;
}

function processQuestionApproval( eventId, questionId, approvedVal, dispatch ) {
    // Write a function that has `dispatch` and `getState` as arguments
    // Make an async HTTP request
    //console.log( "processQuestionApproval" );
    //console.log( eventId );
    //console.log( questionId );
    //console.log( approvedVal );

    return fetch( `${ proxyUrl }/event/${ eventId }/question/${ questionId }/approved`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        body: JSON.stringify( { "approved": approvedVal } )
    } ).then( res => {
        //console.log( res );
        const evts = res.json();
        //console.log( evts );
        return evts;
    } ).then( evts => {
        dispatch( { type: "currentEvent/updateQuestionApproved", payload: { "eventId": eventId, "questionId": questionId, "approvedVal": approvedVal } } );
    } ).catch( err => console.log( err ) );
    // todo, error condition
}

export const { loadEventDetail, addQuestion, adjustQuestionRanking, updateEvent } = eventDetailSlice.actions;

export { fetchEventDetail, processAdjustment, modifyEvent, stringToDate, processAddQuestion, processQuestionApproval };

export default eventDetailSlice.reducer;

