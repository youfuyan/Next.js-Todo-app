import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  getTodosByCategory,
  createTodo,
  updateTodo,
  deleteTodo,
} from '.././api/api-functions';

export default function TodosByCategory() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');

  const router = useRouter();
  const { category } = router.query;

  useEffect(() => {
    async function fetchTodos() {
      if (category) {
        const fetchedTodos = await getTodosByCategory(category);
        setTodos(fetchedTodos);
      }
    }
    fetchTodos();
  }, [category]);

  const handleAddTodo = async () => {
    // Ensure that the newTodo, newTodoContent, and newTodoCategory are not empty or undefined.
    if (newTodo && newTodo.trim() && newTodoContent) {
      const createdTodo = await createTodo(
        newTodo.trim(),
        category,
        newTodoContent
      );
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setNewTodo('');
      setNewTodoContent('');
    } else {
      // Show an error message or alert if the input is invalid.
      console.error('Title, content are required to create a new todo.');
    }
  };
  const handleDeleteTodo = async (_id) => {
    console.log('Deleting todo with id:', _id); // Add this line to log the id value
    await deleteTodo(_id);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
  };

  const handleUpdateTodo = async (_id) => {
    const todoToUpdate = todos.find((todo) => todo._id === _id);
    if (todoToUpdate) {
      const updatedTodo = await updateTodo(
        _id,
        todoToUpdate.title,
        todoToUpdate.category,
        todoToUpdate.content,
        !todoToUpdate.done
      );
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === _id ? updatedTodo : todo))
      );
    }
  };

  return (
    <div>
      <h1>{category} To-Do List Items</h1>
      <h2 className='mt-5'>Add a new to-do item</h2>
      <h3 className='mt-3'>Title</h3>
      <input
        type='text'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder='New to-do'
      />
      <h3 className='mt-3'>Content</h3>
      <textarea
        value={newTodoContent}
        onChange={(e) => setNewTodoContent(e.target.value)}
        placeholder='New to-do content'
      />
      <br />

      <button onClick={handleAddTodo} className='btn btn-primary m-3'>
        Add To-Do
      </button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className='list-group-item d-flex justify-content-between align-items-center'
          >
            <div>
              <Link href={`/todo/${todo._id}`}>
                <strong>{todo.title}</strong>
              </Link>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '300px',
                }}
              >
                {todo.content}
              </div>
            </div>
            <div>
              {todo.done && <span className='ml-2'>Done</span>}

              <button
                onClick={() => handleUpdateTodo(todo._id, !todo.done)}
                className={`btn ${
                  todo.done ? 'btn-secondary' : 'btn-success'
                } m-2`}
              >
                {todo.done ? 'Mark as Undone' : 'Mark as Done'}
              </button>

              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className='btn btn-danger m-2'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Link href='/todos'>View All To-Do Items</Link>
    </div>
  );
}
