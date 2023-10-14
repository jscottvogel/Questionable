const EventDAO = require( '../EventDAO' )

//const dynamoose = require( "dynamoose" );

//const Event = require( '../../models/DynamoDB/Event' );

const AWS = require( 'aws-sdk' );

const uuid = require( 'uuid' );

require( 'dotenv' ).config( { path: './questionable.env' } );

module.exports = class EventDynamoDBImpl extends EventDAO {

    constructor () {
        super();

        // TODO read this from encrypted file
        let accessKeyId = process.env.KEY;
        let secretAccessKey = process.env.SECRET;
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

    addQuestion( evtId, question ) {
        return new Promise( ( resolve, reject ) => {
            //console.log( question );

            if ( question.qid == undefined || question.qid == null ) {
                question.qid = uuid.v4();
            }

            let params = {
                TableName: "Event",
                Key: {
                    "id": evtId
                },
                UpdateExpression: "set questions = list_append(questions, :i)",
                ExpressionAttributeValues: {
                    ':i': [ question ],
                },
                ReturnValues: "UPDATED_NEW"
            };

            this.client.update( params ).promise().then( ( results ) => {
                //console.log( results );
                resolve( results );
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

    createEvent( event ) {
        return new Promise( ( resolve, reject ) => {

            if ( event.id == undefined || event.id == null ) {
                event.id = uuid.v4();
            }

            let params = {
                TableName: "Event",
                Item: {
                    id: event.id,
                    name: event.name,
                    eventDate: event.eventDate,
                    questions: event.questions
                }
            };

            // all good to here
            this.client.put( params ).promise().then( ( results ) => {
                //console.log( results );
                resolve( results );
            } ).catch( ( error ) => {
                console.log( error );
                reject( error );
            } );
        } );
    }

    updateEvent( event ) {
        return new Promise( ( resolve, reject ) => {
            let params = {
                TableName: "Event",
                Key: {
                    "id": event.id
                },
                UpdateExpression: "SET #n = :nm, eventDate = :dt",
                ExpressionAttributeValues: {
                    ":nm": event.name,
                    ":dt": event.eventDate
                },
                ExpressionAttributeNames: {
                    "#n": "name"
                }
            };

            // all good to here
            this.client.update( params ).promise().then( ( results ) => {
                //console.log( results );
                resolve( results );
            } ).catch( ( error ) => {
                console.log( error );
                reject( error );
            } );
        } );
    }

    deleteEvent( eventId ) {
        //console.log( "Deleting Event: " + eventId );
        return new Promise( ( resolve, reject ) => {
            let params = {
                TableName: "Event",
                Key: {
                    "id": eventId
                }
            };

            // all good to here
            this.client.delete( params ).promise().then( ( results ) => {
                //console.log( results );
                resolve( results );
            } ).catch( ( error ) => {
                console.log( error );
                reject( error );
            } );
        } );
    }

    likeQuestion( eventId, questionId ) {
        return this.processIncr( eventId, questionId, 1 );
    }

    dislikeQuestion( eventId, questionId ) {
        return this.processIncr( eventId, questionId, -1 );
    }

    adjustQuestionRanking( eId, qId, adjustment ) {
        return this.processIncr( eventId, questionId, adjustment );
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

