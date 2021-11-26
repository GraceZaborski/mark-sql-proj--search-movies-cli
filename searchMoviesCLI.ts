import { question } from "readline-sync";
import { Client } from "pg";

console.log("Search for a movie or press q to quit");

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
async function searchOMDB() {
    const client = new Client({ database: 'omdb' });
    await client.connect();

    const result = await client.query("SELECT * from casts where movie_id = $1", [
        17,
    ]);
    console.table(result.rows);
    await client.end();
}
console.log("Welcome to search-movies-cli!");

searchOMDB();