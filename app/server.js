import database from './utils/database.js';
import makeApp from './app.js';

const app = makeApp(database);

app.listen(5001, () => console.log("listening on port 5001"));
