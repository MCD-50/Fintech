import express from 'express';
import body_parser from 'body-parser';

const app = express();
const path = require('path');
const port = process.env.PORT || 2000;
const cors = require('cors');


//app use
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

app.use(express.static(path.join(__dirname, 'src')));
app.use(cors());

//import all engines
app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

app.get('/', (req, res) => {
	res.json({
		message: 'Documentation coming soon.'
	});
});
