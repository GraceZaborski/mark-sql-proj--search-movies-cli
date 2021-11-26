import { question } from "readline-sync";
import { Client } from "pg";
const readlineSync = require('readline-sync');


console.log("Search for a movie or press 'q' to quit");
connectOMDB();

var userName = readlineSync.question('May I have your name? ');
console.log('Hi ' + userName + '!');

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
async function connectOMDB() {
    const client = new Client({ database: 'omdb' });
    await client.connect();
    await client.end();
}



