// pages/todos.js
import { useState } from 'react';
import Link from 'next/link';

// Mock data
const initialTodos = [
  { id: 1, title: 'Buy groceries', category: 'Home', done: false },
  { id: 2, title: 'Finish homework', category: 'School', done: false },
  { id: 3, title: 'Clean the house', category: 'Home', done: false },
  { id: 4, title: 'Prepare presentation', category: 'Work', done: false },
];

export default function Todos() {
  const [todos, setTodos] = useState(initialTodos);
  const [categories, setCategories] = useState(['Work', 'Home', 'School']);
  const [newCategory, setNewCategory] = useState('');
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    const newId = todos.length + 1;
    setTodos([
      ...todos,
      { id: newId, title: newTodo, category: '', done: false },
    ]);
    setNewTodo('');
  };

  const handleAddCategory = () => {
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(
      categories.filter((category) => category !== categoryToDelete)
    );
  };

  return (
    <div>
      <h1>To-Do List</h1>

      {/* Category section */}
      <h2>Categories</h2>
      <input
        type='text'
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder='New category'
      />
      <button onClick={handleAddCategory} className='btn btn-primary m-3'>
        Add Category
      </button>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link href={`/todos/${category}`}>{category}</Link>
            <button
              onClick={() => handleDeleteCategory(category)}
              class='btn btn-danger m-2'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* To-do section */}
      <h2>All To-Do Items</h2>
      <input
        type='text'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder='New to-do'
      />
      <button onClick={handleAddTodo} className='btn btn-primary m-3 '>
        Add To-Do
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Link href={`/todo/${todo.id}`}>{todo.title}</Link>
          </li>
        ))}
      </ul>
      <Link href='/done'>View Done Items</Link>
    </div>
  );
}
