// pages/done.js
import Link from 'next/link';

// Mock data
const doneTodos = [
  { id: 3, title: 'Finish homework', done: true },
  { id: 4, title: 'Call mom', done: true },
];

export default function Done() {
  return (
    <div>
      <h1>Done Items</h1>
      <ul>
        {doneTodos.map((todo) => (
          <li key={todo.id}>
            <Link
              href={`/todo/${todo.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {todo.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href='/todos' style={{ textDecoration: 'none', color: 'inherit' }}>
        Back to To-Do List
      </Link>
    </div>
  );
}
