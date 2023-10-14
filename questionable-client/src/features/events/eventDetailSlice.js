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
        processAdjustment: ( state, action ) => {
            const [ eventId, questionId, adjustment ] = action.payload;

            return fetch( `/event/:id/question/:qid/ranking`, {
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

                /*
                            let eventArray = [];
                            eventArray.push( json );
                
                            //console.log( eventArray );
                
                            //HACK - need to fix this, something weird with timing of the fetch and the display
                            adjustRanking( eventArray[ 0 ], questionId, rank, 1 );
                
                            displayQuestionDetails( eventArray[ 0 ] );
                
                            //console.log( "Like Processed:" + eventArray[ 0 ] );
                            likedQuestions[ "likedQuestions" ].push( questionId );
                            window.sessionStorage.setItem( "likedQuestions", JSON.stringify( likedQuestions ) );
                */
            } ).catch( ( error ) => {
                console.log( error.message );
            }
            );
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

export const { loadEventDetail, addQuestion, processAdjustment } = eventDetailSlice.actions;

export { fetchEventDetail };

export default eventDetailSlice.reducer;

