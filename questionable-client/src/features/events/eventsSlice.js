import { createSlice } from '@reduxjs/toolkit';
import { proxyUrl } from '../../app/ProxyConfig';

const initialState = [];

const eventsSlice = createSlice( {
    name: 'events',
    initialState: {
        events: initialState
    },
    reducers: {
        loadEvents: ( state, action ) => {
            // check to see if there are any new events
            // if so, add them to the state
            // if not, do nothing
            if ( state.events.length === 0 ) {
                state.events = action.payload;
            } else {
                let temp = state.events.filter( event => event.id !== action.payload.id );
                if ( temp.length !== state.events.length ) {
                    state.events = action.payload;
                }
            }
        },
        addEvent: ( state, action ) => {
            let evt = action.payload;

            if ( evt !== null ) {
                state.events.push( evt );
            }
        },
        deleteEvent: ( state, action ) => {
            const eventId = action.payload;
            state.events = state.events.filter( event => event.id !== eventId );
        }
    }
} );

// Write a function that has `dispatch` and `getState` as arguments
const fetchEvents = ( dispatch, getState ) => {
    // Make an async HTTP request
    //console.log( `${ proxyUrl }/events` );
    return fetch( `${ proxyUrl }/api/events`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( res => {
        //console.log( res );
        const evts = res.json();
        //console.log( evts );
        return evts;
    } ).then( evts => {
        dispatch( { type: "events/loadEvents", payload: evts } );
    } ).catch( err => console.log( err ) );
    // todo, error condition

}

function removeEvent( id, dispatch ) {
    //console.log( "deleteEvent: " + id );
    return fetch( `${ proxyUrl }/api/event/${ id }`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache" // *default, no-cache, reload, force-cache, only-if-cached
    } )
        .then( response => {
            if ( response.ok ) {
                dispatch( { type: "events/deleteEvent", payload: id } );
            } else {
                console.log( response );
                console.log( "Event not deleted" );
            }
        } )
        .catch( error => {
            console.log( error );
        } );
}

function addNewEvent( newEvent, dispatch ) {
    return fetch( `${ proxyUrl }/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        body: JSON.stringify( newEvent )
    } )
        .then( response => {
            if ( response.ok ) {
                dispatch( { type: "events/addEvent", payload: newEvent } );
                return response.json();
            } else {
                console.log( response );
                console.log( "Event not added" );
                return null;
            }
        } )
        .catch( error => {
            console.log( error );
            return null;
        } );
}

export const { loadEvents, addEvent, deleteEvent } = eventsSlice.actions;

export { fetchEvents, removeEvent, addNewEvent };

export default eventsSlice.reducer;

