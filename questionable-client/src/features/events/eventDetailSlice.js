import { createSlice } from '@reduxjs/toolkit';

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

            fetch( `/event/${ state.currentEvent.id }/question`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { "question": action.payload, "ranking": 0 } ),
                cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
            } ).then( response => response.json() )
                .then( ( temp ) => {
                    return fetch( `/event/${ state.currentEvent.id }`, {
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
        }
    }
} );

const fetchEventDetail = ( dispatch, getState, id ) => {
    // Make an async HTTP request
    return fetch( `/event/${ id }`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( res => { const evts = res.json(); return evts; } )
        .then( evts => {
            dispatch( { type: "currentEvent/loadEventDetail", payload: evts } );
        } ).catch( err => console.log( err ) );
    // todo, error condition
}

const processAdjustment = ( eventId, questionId, adjustment, dispatch ) => {
    console.log( "Making Adjustment: " + adjustment );
    return fetch( `/event/${ eventId }/question/${ questionId }/ranking`, {
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

export const { loadEventDetail, addQuestion, adjustQuestionRanking } = eventDetailSlice.actions;

export { fetchEventDetail, processAdjustment };

export default eventDetailSlice.reducer;

