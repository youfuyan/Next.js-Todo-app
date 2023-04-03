// pages/done/[category].js
import { useRouter } from 'next/router';
import Link from 'next/link';

// Mock data
const doneTodos = [
  { id: 3, title: 'Finish homework', category: 'School', done: true },
  { id: 4, title: 'Call mom', category: 'Home', done: true },
];

export default function DoneByCategory() {
  const router = useRouter();
  const { category } = router.query;

  const filteredDoneTodos = doneTodos.filter(
    (todo) => todo.category === category
  );

  return (
    <div>
      <h1>Done Items ({category})</h1>
      <ul>
        {filteredDoneTodos.map((todo) => (
          <li key={todo.id}>
            <Link href={`/todo/${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
      <Link href='/todos'>Back to To-Do List</Link>
    </div>
  );
}
