const dynamoose = require( "dynamoose" );
//const mongoose = require( 'mongoose' );
const uuid = require( 'uuid' );

//const Schema = mongoose.Schema;
const Schema = dynamoose.Schema;

const eventSchema = new Schema( {
    "id": String,
    "name": String,
    //    "eventDate": Date,
    "eventDate": {
        "type": {
            "value": Date,
            "settings": {
                "storage": "seconds" // Default: milliseconds (as shown above)
            }
        }
    },
    //    "createdDate": Date,
    "createdDate": {
        "type": {
            "value": Date,
            "settings": {
                "storage": "seconds" // Default: milliseconds (as shown above)
            }
        }
    },
    //    "lastModifiedDate": Date,
    "lastModifiedDate": {
        "type": {
            "value": Date,
            "settings": {
                "storage": "seconds" // Default: milliseconds (as shown above)
            }
        }
    },
    //    "questions": [ { "id": String, "question": String, "ranking": Number } ]
    "questions": {
        "type": Array,
        "schema": [ {
            "type": Object,
            "schema": {
                "qid": String,
                "question": String,
                "ranking": Number
                //"isActive": Boolean
            }
        }
        ]
    }
} );

//const Event = mongoose.model( 'Event', eventSchema );
const Event = dynamoose.model( 'Event', eventSchema );

module.exports = Event;

