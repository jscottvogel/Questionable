// for dynamodb
const dynamoose = require( "dynamoose" );

const ddb = new dynamoose.aws.ddb.DynamoDB( {
    "credentials": {
        "accessKeyId": "",
        "secretAccessKey": ""
    },
    "region": "us-east-1"
} );

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set( ddb );


//const mongoose = require( 'mongoose' );

const uuid = require( 'uuid' );

const Event = require( './models/Event' );

//mongoose.connect( 'mongodb://localhost:27017/questionable', { useNewUrlParser: true, useUnifiedTopology: true } );

try {
    Event.create( {
        "id": uuid.v4(),
        "name": 'The Big Event',
        "eventDate": new Date( '2020-01-01' ),
        "questions": [ { "qid": uuid.v4(), "question": "Are you a Cowboys fan?", "ranking": 0 }, { "qid": uuid.v4(), "question": "What is your name?", "ranking": 5 } ]
    } );
} catch ( err ) {
    console.log( err );
}

