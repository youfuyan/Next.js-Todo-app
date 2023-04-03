// pages/todos/[category].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Mock data
const categories = ['Work', 'Home', 'School'];
const initialTodos = [
  { id: 1, title: 'Buy groceries', category: 'Home', done: false },
  { id: 2, title: 'Finish homework', category: 'School', done: false },
  { id: 3, title: 'Clean the house', category: 'Home', done: false },
  { id: 4, title: 'Prepare presentation', category: 'Work', done: false },
];

export default function TodosByCategory() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const router = useRouter();
  const { category } = router.query;

  const handleAddTodo = () => {
    const newId = todos.length + 1;
    setTodos([...todos, { id: newId, title: newTodo, category, done: false }]);
    setNewTodo('');
  };

  const filteredTodos = todos.filter(
    (todo) => todo.category === category && !todo.done
  );

  return (
    <div>
      <h1>{category} To-Do List</h1>
      <input
        type='text'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder='New to-do'
      />
      <button onClick={handleAddTodo} className='btn btn-primary m-3'>
        Add To-Do
      </button>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <Link href={`/todo/${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
      <Link href='/todos'>View All To-Do Items</Link>
    </div>
  );
}
