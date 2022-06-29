import express from 'express';
import bodyParser from 'body-parser';

const PORT = 3005;

let names = ['Peter', 'Jenna', 'Laura'];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/names', (req, res) => {
  res.status(200).json(names);
});

app.post('/names', (req, res) => {
  const { body } = req;
  if (!body?.name) {
    res.status(400).send('Body doesn\'t include the required "name" parameter.');
    return;
  }

  const alreadyExists = names.some(name => name.toLowerCase() === body.name.toLowerCase());
  if (alreadyExists) {
    res.status(422).send(`Name "${body.name}" already exists.`);
    return;
  }

  names.push(body.name);

  res.status(201).json(names);
});

app.delete('/names', (req, res) => {
  const { query } = req;
  if (!query?.name) {
    res.status(400).send('Query param "name" not found.');
    return;
  }

  const nameExists = names.some(name => name.toLowerCase() === query.name.toLowerCase());
  if (!nameExists) {
    res.status(404).send(`Name "${query.name}" not found.`);
    return;
  }

  names = names.filter(name => name.toLowerCase() !== query.name.toLowerCase());
  res.status(200).json(names);
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
