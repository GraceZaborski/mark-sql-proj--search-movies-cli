import { question } from "readline-sync";
import { Client } from "pg";
const readlineSync = require('readline-sync');


let userReturn = readlineSync.question("Search for a movie or press 'q' to quit: ");
console.log(`You entered ${userReturn}`);
if (userReturn != 'q') {
    connectAndSearchOMDB()
} else {
    console.log("Server not connected.")
}

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
async function connectAndSearchOMDB() {
    const client = new Client({ database: 'omdb' });
    await client.connect();
    const searchResult = await client.query
        ("SELECT DISTINCT movie_id, movie_name from casts_view where lower(movie_name) like $1 LIMIT 10", [`%${userReturn.toLowerCase()}%`]);
    console.table(searchResult.rows);
    await client.end();
}



