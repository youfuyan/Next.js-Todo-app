// pages/todos.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import { useAuth, openSignIn } from '@clerk/nextjs';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');

  // State variable to control the visibility of the left menu
  const [showLeftMenu, setShowLeftMenu] = useState(true);

  const router = useRouter();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [jwt, setJwt] = useState('');
  // Redirect to home page if user is not signed in
  useEffect(() => {
    if (!isLoaded && !userId) {
      router.push('/');
    }
  }, [userId, isLoaded, router]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (userId) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const todos = await getAllTodos(jwt, userId);
        console.log('Fetched todos:', todos);
        setTodos(todos);
        // Get the unique categories from the todos
        const categories = [...new Set(todos.map((todo) => todo.category))];
        setCategories(categories);
      }
    };
    fetchTodos();
  }, [userId, jwt]);

  const handleAddTodo = async () => {
    // Ensure that the newTodo, newTodoContent, and newTodoCategory are not empty or undefined.
    if (newTodo && newTodo.trim() && newTodoContent && newTodoCategory) {
      const createdTodo = await createTodo(
        jwt,
        userId,
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
    await deleteTodo(jwt, _id);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
  };

  const handleUpdateTodo = async (_id) => {
    const todoToUpdate = todos.find((todo) => todo._id === _id);
    if (todoToUpdate) {
      const updatedTodo = await updateTodo(
        jwt,
        userId,
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
        jwt,
        userId,
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

  // Filter out the todos that are marked as done
  const pendingTodos = todos.filter((todo) => !todo.done);

  return (
    <div>
      {/* Check if the user is signed in before rendering the content */}
      {userId ? (
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
                <Form className='p-3'>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder='New category'
                    />
                  </Form.Group>
                  <Button
                    onClick={handleAddCategory}
                    className='btn btn-primary mt-2'
                  >
                    Add Category
                  </Button>
                </Form>
                <ListGroup className='p-3'>
                  {/* Filter out null categories before mapping */}
                  {categories
                    .filter((cat) => cat)
                    .map((category) => (
                      <ListGroup.Item
                        key={category}
                        className='d-flex justify-content-between'
                      >
                        <div className='d-flex justify-content-between align-items-center'>
                          <Link href={`/todos/${category}`}>{category}</Link>
                          <Button
                            onClick={() => handleDeleteCategory(category)}
                            variant='danger'
                          >
                            Delete
                          </Button>
                        </div>
                        <ListGroup className='mt-3'>
                          {todos
                            .filter((todo) => todo.category === category)
                            .map((todo) => (
                              <ListGroup.Item key={todo._id}>
                                <Link href={`/todo/${todo._id}`}>
                                  {todo.title}
                                </Link>
                              </ListGroup.Item>
                            ))}
                        </ListGroup>
                      </ListGroup.Item>
                    ))}
                  {/* show todo based on category */}
                </ListGroup>
              </div>
            </Collapse>
            <div
              className={`mainContent ${showLeftMenu ? 'mainContentOpen' : ''}`}
            >
              {/* To-do section */}
              <Container className='mt-4'>
                <h2>All To-Do Items</h2>
                <Form>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder='New to-do'
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type='text'
                      value={newTodoContent}
                      onChange={(e) => setNewTodoContent(e.target.value)}
                      placeholder='New to-do content'
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      as='select'
                      value={newTodoCategory}
                      onChange={(e) => setNewTodoCategory(e.target.value)}
                    >
                      <option value=''>Select category</option>
                      {/* Filter out null categories */}
                      {categories
                        .filter((cat) => cat)
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  <Button
                    onClick={handleAddTodo}
                    className='btn btn-primary mt-2'
                  >
                    Add To-Do
                  </Button>
                </Form>
                <ListGroup className='mt-4'>
                  {pendingTodos.map((todo) => (
                    <ListGroup.Item
                      key={todo._id}
                      className='d-flex justify-content-between align-items-center'
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
                        {todo.done && (
                          <Badge className='ml-2' variant='success'>
                            Done
                          </Badge>
                        )}
                        <Button
                          onClick={() => handleUpdateTodo(todo._id, !todo.done)}
                          className={`btn ${
                            todo.done ? 'btn-secondary' : 'btn-success'
                          } m-2`}
                        >
                          {todo.done ? 'Mark as Undone' : 'Mark as Done'}
                        </Button>
                        <Button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className='btn btn-danger m-2'
                        >
                          Delete
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link href='/done'>
                  <Button className='mt-3' variant='secondary'>
                    View Done Items
                  </Button>
                </Link>
              </Container>
            </div>
          </div>
        </div>
      ) : (
        <Container className='text-center mt-5'>
          {/* Show sign-in button if the user is not signed in */}
          <p>Please log in to access your Todo List.</p>
          <Button onClick={openSignIn}>Log in</Button>
        </Container>
      )}
    </div>
  );
}
