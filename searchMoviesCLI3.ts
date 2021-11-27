import { question, questionInt } from "readline-sync";
import { Client } from "pg";
const readlineSync = require('readline-sync');

console.log('Welcome to search-movies-cli!')
connectOMDB()


async function connectOMDB() {
    const client = new Client({ database: 'omdb' })
    await client.connect();
    chooseOption(client)
}


function chooseOption(client: Client) {
    let action = readlineSync.question("Choose an action! \n\n[1]Search\n[2]See Favourites\n[3]Quit");
    if (action === '1') {
        searchOMDB(client)
        console.log('1')
    } else if (action === '2') {
        showFavourites(client)
        console.log('2')
    } else if (action === '3') {
        quit(client)
        console.log('3')
    }
}

async function searchOMDB(client: Client) {
    let userReturn = readlineSync.question("Search term: ");
    const searchResult = await client.query
        ("SELECT DISTINCT movie_id, movie_name, date from casts_view where kind = 'movie' AND lower(movie_name) like $1 ORDER BY date desc LIMIT 8", [`%${userReturn.toLowerCase()}%`]);
    console.table(searchResult.rows);
    for (let index = 0; index < 8; index++) {
        console.log(`[${(index + 1)}] ${searchResult.rows[index].movie_name}`)
    }
    console.log(`[0] CANCEL`)
    let userFavourite = readlineSync.question("Choose a movie row number to favourite [1...8 / 0]: ");
    console.log(`Saving favourite movie: ${searchResult.rows[userFavourite - 1].movie_name}`)
    const favouriteId = searchResult.rows[userFavourite - 1].movie_id
    console.log(favouriteId)
    const favouriteTableQuery =
        "INSERT INTO fave_movies_names (movie_id, movie_name) VALUES ($1, $2)";
    const values = [`${searchResult.rows[userFavourite - 1].movie_id}`, `${searchResult.rows[userFavourite - 1].movie_name}`];
    const favouriteTable = await client.query(favouriteTableQuery, values);
    chooseOption(client)
}

async function showFavourites(client: Client) {
    console.log('Here are your saved favourites!')
    const favouriteTableReturn = await client.query("SELECT * FROM fave_movies_names LIMIT 8");
    console.table(favouriteTableReturn.rows)
    chooseOption(client)
}

async function quit(client: Client) {
    await client.end();
}


