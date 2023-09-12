const path = require( 'path' );


const controllerFactory = require( '../controllers/ControllerFactory' );
require( '../controllers/EventControllers/EventController' );

try {
    /*
        Event.create( {
            "id": uuid.v4(),
            "name": 'The Big Event',
            "eventDate": new Date( '2020-01-01' ),
            "questions": [ { "qid": uuid.v4(), "question": "Are you a Cowboys fan?", "ranking": 0 }, { "qid": uuid.v4(), "question": "What is your name?", "ranking": 5 } ]
        } );
        */

    testCreateEvent = async () => {
        let event = {
            "id": uuid.v4(),
            "name": 'Event Two',
            "eventDate": new Date( '2023-09-01' ),
            "questions": [ { "qid": uuid.v4(), "question": "What is up?", "ranking": 0 }, { "qid": uuid.v4(), "question": "What is you favorite color?", "ranking": 0 } ]
        };
        return await controllerFactory.getEventController().createEvent( event );
    }

    testCreateEvent().then( ( results ) => {
        console.log( results );
    } ).catch( ( error ) => {
        console.log( error );
    } );

} catch ( err ) {
    console.log( err );
}

