let like =
    async ( questionId ) => {
        try {
            const response = await fetch( "/like/" + questionId, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { like: questionId } )
            } );

            const json = await response.json();

            console.log(
                json
            );
        } catch ( error ) {
            console.error( error );
        }
    };

let dislike =
    async ( questionId ) => {
        try {
            const response = await fetch( "/dislike/" + questionId, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { like: questionId } )
            } );

            const json = await response.json();

            console.log(
                json
            );
        } catch ( error ) {
            console.error( error );
        }
    };

