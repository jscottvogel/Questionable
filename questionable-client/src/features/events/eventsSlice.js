import { createSlice } from '@reduxjs/toolkit';

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
            state.events.push( action.payload );
        },
        deleteEvent: ( state, action ) => {
            const eventId = action.payload;
            state.events = state.events.filter( event => event.id !== eventId );
        },
        updateEvent: ( state, action ) => {
            const { id, title, description, date, time } = action.payload;
            const existingEvent = state.events.find( event => event.id === id );
            if ( existingEvent ) {
                existingEvent.title = title;
                existingEvent.description = description;
                existingEvent.date = date;
                existingEvent.time = time;
            }
        }
    }
} );

// Write a function that has `dispatch` and `getState` as arguments
const fetchEvents = ( dispatch, getState ) => {
    // Make an async HTTP request
    return fetch( '/events', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    } ).then( res => { const evts = res.json(); return evts; } )
        .then( evts => {
            dispatch( { type: "events/loadEvents", payload: evts } );
        } ).catch( err => console.log( err ) );
    // todo, error condition

}

export const { loadEvents, addEvent, deleteEvent, updateEvent } = eventsSlice.actions;

export { fetchEvents };

export default eventsSlice.reducer;

