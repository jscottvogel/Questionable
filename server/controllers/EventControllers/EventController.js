const EventDAO = require( '../../dao/EventDAO' );
const EventDynamoDBImpl = require( '../../dao/DynamoDB/EventDynamoDBImpl' );

// Description: EventController class is a class that is used to handle all the events that are happening in the application.
module.exports = class EventController {
    constructor () {
        this.eventDB = new EventDynamoDBImpl();
    }

    likeQuestion( eId, qId ) {
        return this.eventDB.likeQuestion( eId, qId );
    }

    dislikeQuestion( eId, qId ) {
        return this.eventDB.dislikeQuestion( eId, qId );
    }

    adjustQuestionRanking( eId, qId, adjustment ) {
        return this.eventDB.adjustQuestionRanking( eId, qId, adjustment );
    }

    findEventById( eId ) {
        return this.eventDB.findEventById( eId );
    }

    findEvents() {
        return this.eventDB.findEvents();
    }

    addQuestion( eventId, question ) {
        return this.eventDB.addQuestion( eventId, question );
    }

    updateQuestion( eventId, question ) {
        return this.eventDB.updateQuestion( eventId, question );
    }

    createEvent( event ) {
        return this.eventDB.createEvent( event );
    }

    updateEvent( event ) {
        return this.eventDB.updateEvent( event );
    }

    deleteEvent( eventId ) {
        return this.eventDB.deleteEvent( eventId );
    }

    updateQuestionApproval( evtId, question, approvedVal ) {
        return this.eventDB.updateQuestionApproval( evtId, question, approvedVal );
    }
}