// pages/todo/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Mock data
const todos = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Clean the house', done: false },
  { id: 3, title: 'Finish homework', done: true },
  { id: 4, title: 'Call mom', done: true },
];
const categories = ['Work', 'Home', 'School'];

export default function TodoItem() {
  const router = useRouter();
  const { id } = router.query;
  const todo = todos.find((todo) => todo.id === parseInt(id));

  const [updatedTodo, setUpdatedTodo] = useState(todo ? todo.title : '');
  const [selectedCategory, setSelectedCategory] = useState(
    todo ? todo.category : ''
  );
  const [isDone, setIsDone] = useState(todo ? todo.done : false);

  const handleSave = () => {
    // Implement save functionality to update the to-do item
    // Redirect to /todos after saving
    router.push('/todos');
  };

  const handleToggleDone = () => {
    setIsDone(!isDone);
  };

  if (!todo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit To-Do Item</h1>
      <textarea
        value={updatedTodo}
        onChange={(e) => setUpdatedTodo(e.target.value)}
      />
      <br />
      <label>
        Category:
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={handleSave} className='btn btn-primary m-3'>
        Save
      </button>
      <br />
      <input
        type='checkbox'
        checked={isDone}
        onChange={handleToggleDone}
      />{' '}
      Mark as done
      <br />
      <Link href='/todos' style={{ textDecoration: 'none', color: 'inherit' }}>
        Back to To-Do List
      </Link>
    </div>
  );
}
