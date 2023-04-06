// pages/todos.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
} from './api/api-functions';
import {
  Collapse,
  Button,
  Navbar,
  Container,
  ListGroup,
  Form,
  InputGroup,
  Badge,
} from 'react-bootstrap';
import { BsList } from 'react-icons/bs'; // Hamburger menu icon

// Mock data
// const initialTodos = [
//   { id: 1, title: 'Buy groceries', category: 'Home', done: false },
//   { id: 2, title: 'Finish homework', category: 'School', done: false },
//   { id: 3, title: 'Clean the house', category: 'Home', done: false },
//   { id: 4, title: 'Prepare presentation', category: 'Work', done: false },
// ];

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');

  // State variable to control the visibility of the left menu
  const [showLeftMenu, setShowLeftMenu] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await getAllTodos();
      console.log('Fetched todos:', todos); // Add this line to log the todos
      setTodos(todos);
      // Get the unique categories from the todos
      const categories = [...new Set(todos.map((todo) => todo.category))];
      setCategories(categories);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    // Ensure that the newTodo, newTodoContent, and newTodoCategory are not empty or undefined.
    if (newTodo && newTodo.trim() && newTodoContent && newTodoCategory) {
      const createdTodo = await createTodo(
        newTodo.trim(),
        newTodoCategory,
        newTodoContent
      );
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      setNewTodo('');
      setNewTodoContent('');
      setNewTodoCategory('');
    } else {
      // Show an error message or alert if the input is invalid.
      console.error(
        'Title, content, and category are required to create a new todo.'
      );
    }
  };

  const handleDeleteTodo = async (_id) => {
    console.log('Deleting todo with id:', _id); //to log the id value
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

  const handleAddCategory = () => {
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };
  //update all todo's category in that category to null if category is deleted
  const handleDeleteCategory = async (categoryToDelete) => {
    setCategories(
      categories.filter((category) => category !== categoryToDelete)
    );
    // Filter out the todos that belong to the category to be deleted
    const todosToUpdate = todos.filter(
      (todo) => todo.category === categoryToDelete
    );
    // Update each todo's category to null in the state and backend
    for (const todo of todosToUpdate) {
      const updatedTodo = await updateTodo(
        todo._id,
        todo.title,
        null,
        todo.content,
        todo.done
      );
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === todo._id ? updatedTodo : t))
      );
    }
  };

  const filterTodosByCategory = (category) => {
    return todos.filter((todo) => todo.category === category && !todo.done);
  };

  return (
    <div>
      {/* Top bar with toggle button */}

      <Navbar
        expand={false}
        variant='dark'
        style={{ backgroundColor: '#dc4c3e' }}
      >
        <Navbar.Toggle
          aria-controls='category-section'
          onClick={() => setShowLeftMenu(!showLeftMenu)}
        >
          <BsList />
        </Navbar.Toggle>
        <Navbar.Brand>To-Do List</Navbar.Brand>
      </Navbar>
      {/* Container to wrap side menu and main content */}
      <div className='contentContainer' style={{ display: 'flex' }}>
        {/* Category section */}
        <Collapse in={showLeftMenu}>
          <div
            id='category-section'
            className={`sideMenu ${
              showLeftMenu ? 'sideMenuOpen' : 'sideMenuClose'
            }`}
          >
            <h2 className='p-3'>Categories</h2>
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
              {/* Filter out null categories before mapping */}
              {categories
                .filter((cat) => cat)
                .map((category) => (
                  <li key={category}>
                    <h3>
                      <Link href={`/todos/${category}`}>{category}</Link>{' '}
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className='btn btn-danger'
                      >
                        Delete
                      </button>
                    </h3>

                    <ul>
                      {filterTodosByCategory(category).map((todo) => (
                        <li key={todo._id}>
                          <Link href={`/todo/${todo._id}`}>{todo.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        </Collapse>
        <div className={`mainContent ${showLeftMenu ? 'mainContentOpen' : ''}`}>
          {/* To-do section */}
          <h2 className='p-3'>All To-Do Items</h2>
          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='New to-do'
          />
          <input
            type='text'
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            placeholder='New to-do content'
          />
          <select
            value={newTodoCategory}
            onChange={(e) => setNewTodoCategory(e.target.value)}
          >
            <option value=''>Select category</option>
            {/* //filter out null categories */}
            {categories
              .filter((cat) => cat)
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>

          <button onClick={handleAddTodo} className='btn btn-primary m-3 '>
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
          <Link href='/done'>View Done Items</Link>
        </div>
      </div>
    </div>
  );
}
