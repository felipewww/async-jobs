import express from 'express';
import {json, urlencoded, text} from 'express';
import {Routes} from "@Infra/Framework/Routes";
import cors from 'cors';

const app = express();

app.use(json()); //bodyParser
app.use(urlencoded());
app.use(text())
app.use(cors({
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

new Routes(app).setRoutes();

app.listen(process.env.APP_PORT, () => {
    const msg = 'Listening on port';
    const port = process.env.APP_PORT.toString();

    console.log('\n')
    console.log(msg + ' ' + port)
    console.log('\n')
});
