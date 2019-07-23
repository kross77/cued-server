import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import addRoutes from "./routes";


const app = express();
app.use(morgan('combined'));
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



addRoutes(app)

export default app;