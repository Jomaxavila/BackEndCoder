import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import MongoStore from "connect-mongo"


const app = express()
app.use(cookieParser());

app.use(session({
	store: MongoStore.create({
		mongoUrl: "mongodb+srv://jomaxavila:Fede1529@ecommerce.betvrpg.mongodb.net/?retryWrites=true&w=majority",
		mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		ttl:15
	}),
	secret: "12345abcd",
	resave: false,
	saveUninitialized: false
}))

const server = app.listen('8080', () => console.log("server Arriba"));

app.get('/', (req, res) => {
	req.session.counter = 1;
	res.send('Bienvenido')
})
