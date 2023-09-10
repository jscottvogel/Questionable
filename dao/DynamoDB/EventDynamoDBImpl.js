const EventDAO = require( '../EventDAO' )

//const dynamoose = require( "dynamoose" );

//const Event = require( '../../models/DynamoDB/Event' );

const AWS = require( 'aws-sdk' );

const uuid = require( 'uuid' );


module.exports = class EventDynamoDBImpl extends EventDAO {

    constructor () {
        super();

        // TODO read this from encrypted file
        let accessKeyId = "";
        let secretAccessKey = "";
        AWS.config.credentials = new AWS.Credentials( accessKeyId, secretAccessKey, null );

        AWS.config.update( { region: 'us-east-1' } );

        this.client = new AWS.DynamoDB.DocumentClient();
    }

    findEventById( id ) {
        return new Promise( ( resolve, reject ) => {
            // TODO configure this to use the event model and save only the new questions
            let params = {
                TableName: "Event",
                Key: {
                    "id": id
                }
            };

            //console.log( id );

            // all good to here
            this.client.get( params ).promise().then( ( data ) => {
                //console.log( data );
                //console.log( data.Item );

                resolve( data.Item );
            } ).catch( ( error ) => {
                console.log( error );
                reject( error );
            } );

        } );
    }

    findEventByIdAndUpdate( evts ) {
        return new Promise( ( resolve, reject ) => {
            //console.log( evts[ 0 ] );

            evts[ 0 ].questions.forEach( ( q ) => {
                //console.log( "Checking Questions..." );
                //console.log( q );
                if ( q.qid == undefined || q.qid == null ) {
                    q.qid = uuid.v4();
                    //console.log( q );
                }
            } );

            // all good to here

            // TODO configure this to use the event model and save only the new questions
            let params = {
                TableName: "Event",
                Item: {
                    "id": evts[ 0 ].id,
                    "name": evts[ 0 ].name,
                    "eventDate": evts[ 0 ].eventDate,
                    "createdDate": evts[ 0 ].createdDate,
                    "lastModifiedDate": evts[ 0 ].lastModifiedDate,
                    "questions": evts[ 0 ].questions
                },
                ReturnValues: "ALL_OLD"
            };

            this.client.put( params ).promise().then( ( results ) => {
                //console.log( results );
                resolve( evts[ 0 ] );
            } ).catch( ( error ) => {
                console.log( error );
                reject( error );
            } );
        } );
    }

    findEvents() {
        let params = {
            TableName: "Event"
        };

        return this.client.scan( params ).promise();
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
        return this.processIncr( eventId, questionId, 1 );
    }

    dislikeQuestion( eventId, questionId ) {
        return this.processIncr( eventId, questionId, -1 );
    }

    processIncr( eventId, questionId, incr ) {
        return new Promise( ( resolve, reject ) => {
            let params = {
                TableName: "Event",
                Key: {
                    "id": eventId
                }
            };

            this.client.get( params ).promise().then( ( data ) => {
                //console.log( data );
                //console.log( data.Item );

                let event = data.Item;
                // find the index of the question
                let index = event.questions.findIndex( ( q ) => {
                    //console.log( q.qid );
                    return ( q.qid === questionId );
                }
                );

                //console.log( values );
                //console.log( values[ 0 ] );
                //console.log( values[ 1 ] );

                // increment the ranking
                let vd = {
                    "index": index,
                    "event": event
                };

                return ( vd );

            } ).then( ( values ) => {
                //console.log( "Index = " + values.index );
                //console.log( "Event Id = " + values.event.id );

                let params = {
                    TableName: "Event",
                    Key: {
                        "id": eventId
                    },
                    UpdateExpression: "SET questions[" + values.index + "].ranking = questions[" + values.index + "].ranking + :incr",
                    ExpressionAttributeValues: {
                        ":incr": incr
                    }
                };
                // all good to here
                this.client.update( params ).promise().then( ( results ) => {
                    //console.log( results );
                    values.event.questions[ values.index ].ranking += incr;
                    resolve( results );
                } ).catch( ( error ) => {
                    console.log( error );
                    reject( error );
                } );

                //console.log( values.event );
                // this is good. but return the result of the update
                resolve( values.event );
            } ).catch( ( error ) => {
                console.log( error );
                reject( error );
            } );

        } );
    }
}

