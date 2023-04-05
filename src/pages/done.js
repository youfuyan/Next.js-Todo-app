import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllTodos } from './api/api-functions';

export default function Done() {
  const [doneTodos, setDoneTodos] = useState([]);

  useEffect(() => {
    const fetchDoneTodos = async () => {
      const todos = await getAllTodos();
      const doneItems = todos.filter((todo) => todo.done);
      setDoneTodos(doneItems);
    };
    fetchDoneTodos();
  }, []);

  return (
    <div>
      <h1>Done Items</h1>
      <ul>
        {doneTodos.map((todo) => (
          <li key={todo._id}>
            <Link
              href={`/todo/${todo._id}`}
              style={{ textDecoration: 'line-through' }}
            >
              {todo.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href='/todos'>Back to To-Do List</Link>
    </div>
  );
}
