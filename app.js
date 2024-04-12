import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;


app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/api/data', (req, res) => {
  const requestData = req.body;

  res.json({ message: 'Data received successfully', data: requestData });
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
