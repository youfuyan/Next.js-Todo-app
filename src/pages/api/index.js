// React backend example app
import { app, Datastore } from 'codehooks-js';

// REST API
app.get('/hello', async (req, res) => {
  const db = await Datastore.open();
  // increment visit counter in key-value database
  const visits = await db.incr('hits', 1);
  res.json({ message: "Welcome to Youfu's App ", visits: visits });
});

// Create a new to-do item
app.post('/api/todos', async (req, res) => {
  const { title, category } = req.body;
  const db = await Datastore.open();
  // Create a new item with an auto-incrementing ID
  const id = await db.incr('id_counter', 1);
  const newItem = { id, title, category, done: false };
  // Save the new item to the database
  await db.set(`todos:${id}`, newItem);
  res.json(newItem);
});

// bind to serverless runtime
export default app.init();
