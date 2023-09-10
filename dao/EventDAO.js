"use strict";

module.exports = class EventDAO {

    findEventById( id ) {
        throw new Error( 'findEvent() not implemented' );
    }

    findEventByIdAndUpdate( id, event ) {
        throw new Error( 'findEvent() not implemented' );
    }

    findEvents() {
        throw new Error( 'findEvents() not implemented' );
    }

    async createEvent() {
        throw new Error( 'createEvent() not implemented' );
    }

    async updateEvent() {
        throw new Error( 'updateEvent() not implemented' );
    }

    async deleteEvent() {
        throw new Error( 'deleteEvent() not implemented' );
    }

    likeQuestion( eventId, questionId ) {
        throw new Error( 'likeQuestion() not implemented' );
    }

    dislikeQuestion( eventId, questionId ) {
        throw new Error( 'dislikeQuestion() not implemented' );
    }
}