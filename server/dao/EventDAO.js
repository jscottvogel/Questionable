"use strict";

module.exports = class EventDAO {

    findEventById( id ) {
        throw new Error( 'function not implemented' );
    }

    addQuestion( eventId, question ) {
        throw new Error( 'function not implemented' );
    }

    findEvents() {
        throw new Error( 'function not implemented' );
    }

    createEvent( event ) {
        throw new Error( 'function not implemented' );
    }

    updateEvent( event ) {
        throw new Error( 'function not implemented' );
    }

    deleteEvent( eventId ) {
        throw new Error( 'function not implemented' );
    }

    likeQuestion( eventId, questionId ) {
        throw new Error( 'function not implemented' );
    }

    dislikeQuestion( eventId, questionId ) {
        throw new Error( 'function not implemented' );
    }

    adjustQuestionRanking( eventId, questionId, adjustment ) {
        throw new Error( 'function not implemented' );
    }
}