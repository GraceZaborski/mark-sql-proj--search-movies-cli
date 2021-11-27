import { question } from "readline-sync";
import { Client } from "pg";
const readlineSync = require('readline-sync');

console.log("Welcome to search-movies-cli!\n\n[1]Search\n[2]See Favourites\n[3]Quit\n")

let action = readlineSync.question("Choose an action! [1, 2, 3]: ");
if (action = '1') {
    connectAndSearchOMDB()
} else {
    console.log("Server not connected.")
}

async function connectAndSearchOMDB() {
    const client = new Client({ database: 'omdb' });
    await client.connect();
    let userReturn = readlineSync.question("Search term: ");
    const searchResult = await client.query
        ("SELECT DISTINCT movie_id, movie_name, date from casts_view where kind = 'movie' AND lower(movie_name) like $1 ORDER BY date desc LIMIT 10", [`%${userReturn.toLowerCase()}%`]);
    console.table(searchResult.rows);
    for (let index = 0; index < 10; index++) {
        console.log(`[${index}] ${searchResult.rows[index].movie_name}`)
    }
    await client.end();
}



