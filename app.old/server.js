import database from '../app/utils/database.js'
import makeApp from '../app/app.js'

const app = makeApp(database)

app.listen(port, () => {
    console.log('Server listen on http://localhost:5001');
});