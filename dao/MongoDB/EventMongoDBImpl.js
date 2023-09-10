const EventDAO = require( './EventDAO' )

// for dynamodb
const dynamoose = require( "dynamoose" );

const ddb = new dynamoose.aws.ddb.DynamoDB( {
    "credentials": {
        "accessKeyId": "AKIAXSLXH5GYZV4ZGDFS",
        "secretAccessKey": "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"
    },
    "region": "us-east-1"
} );

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set( ddb );

// for mongodb
//const mongoose = require( 'mongoose' );



const uuid = require( 'uuid' );

const Event = require( '../../models/DynamoDB/Event' );


module.exports = class EventDynamoDBImpl extends EventDAO {

    findEventById( id ) {
        throw new Error( 'findEvent() not implemented' );
    }

    findEventByIdAndUpdate( id, event ) {
        throw new Error( 'findEvent() not implemented' );
    }

    findEvents() {
        throw new Error( 'findEvents() not implemented' );
    }

    createEvent() {
        throw new Error( 'createEvent() not implemented' );
    }

    updateEvent() {
        throw new Error( 'updateEvent() not implemented' );
    }

    deleteEvent() {
        throw new Error( 'deleteEvent() not implemented' );
    }

    likeQuestion( eventId, questionId ) {
        throw new Error( 'likeQuestion() not implemented' );
    }

    dislikeQuestion( eventId, questionId ) {
        throw new Error( 'dislikeQuestion() not implemented' );
    }
}