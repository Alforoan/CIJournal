import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();

const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


async function appendToFile(filePath, data) {
  try {
    await fs.promises.appendFile(filePath, data);
    console.log(`Data appended to file: ${data}`);
  } catch (err) {
    console.error('Error appending to file:', err);
    throw err; 
  }
}

async function readAndParseFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const parsedData = data
      .split('\n')
      .filter((entry) => entry.trim() !== '')
      .map(JSON.parse);
    return parsedData;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err; 
  }
}

app.get('/api/journals', async (req, res) => {
  try {

    const filePath = 'journals.txt';
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return res.status(404).json({ error: 'File not found' });
    }

   
    const journals = await readAndParseFile(filePath);

 
    res.json({ journals });
  } catch (err) {
    console.error('Error handling GET request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/journals', async (req, res) => {
  const { title, date, journal } = req.body;

  const jsonData = JSON.stringify({ title, date, journal }) + '\n';

  try {
    const filePath = 'journals.txt';
    if (!fs.existsSync(filePath)) {
      await fs.promises.writeFile(filePath, '');
      console.log(`File created: ${filePath}`);
    }


    await appendToFile(filePath, jsonData);


    res.json({ message: 'Data received and appended to file successfully' });
  } catch (err) {
    console.error('Error handling POST request:', err);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});



app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
