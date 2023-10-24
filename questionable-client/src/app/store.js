import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '../features/events/eventsSlice';
import eventDetailReducer from '../features/events/eventDetailSlice';

export default configureStore( {
    reducer: {
        events: eventsReducer,
        currentEvent: eventDetailReducer
    },
} );