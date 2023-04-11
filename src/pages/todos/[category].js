import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  getTodosByCategory,
  createTodo,
  updateTodo,
  deleteTodo,
} from '.././api/api-functions';
import {
  Container,
  Card,
  ListGroup,
  Form,
  InputGroup,
  Button,
  FormControl,
  Badge,
} from 'react-bootstrap';
import { useAuth, SignInButton } from '@clerk/nextjs';

export default function TodosByCategory() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoContent, setNewTodoContent] = useState('');

  const router = useRouter();
  const { category } = router.query;
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [jwt, setJwt] = useState('');

  // Redirect to home page if user is not signed in
  useEffect(() => {
    if (!isLoaded && !userId) {
      router.push('/');
    }
  }, [userId, isLoaded, router]);

  useEffect(() => {
    async function fetchTodos() {
      if (userId && category) {
        const fetchedTodos = await getTodosByCategory(jwt, userId, category);
        setTodos(fetchedTodos);
      }
    }
    fetchTodos();
  }, [userId, jwt, category]);

  const handleAddTodo = async () => {
    // Ensure that the newTodo, newTodoContent, and newTodoCategory are not empty or undefined.
    if (newTodo && newTodo.trim() && newTodoContent) {
      const createdTodo = await createTodo(
        jwt,
        userId,
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
  // Filter out the todos that are marked as done
  const pendingTodos = todos.filter((todo) => !todo.done);

  return (
    <Container className='my-4'>
      {/* Check if the user is signed in before rendering the content */}
      {userId ? (
        <div>
          <h1 className='mb-4'>{category} To-Do List Items</h1>
          <Card className='mb-4'>
            <Card.Header>Add a new to-do item</Card.Header>
            <Card.Body>
              <Form.Group className='mb-3'>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type='text'
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder='New to-do'
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as='textarea'
                  value={newTodoContent}
                  onChange={(e) => setNewTodoContent(e.target.value)}
                  placeholder='New to-do content'
                />
              </Form.Group>
              <Button onClick={handleAddTodo} className='btn btn-primary'>
                Add To-Do
              </Button>
            </Card.Body>
          </Card>
          <ListGroup variant='flush'>
            {pendingTodos.map((todo) => (
              <ListGroup.Item key={todo._id}>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <Link href={`/todo/${todo._id}`}>
                      <strong>{todo.title}</strong>
                    </Link>
                    <div>{todo.content}</div>
                  </div>
                  <div>
                    {todo.done && (
                      <Badge className='ml-2' bg='success'>
                        Done
                      </Badge>
                    )}
                    <Button
                      onClick={() => handleUpdateTodo(todo._id, !todo.done)}
                      variant={todo.done ? 'secondary' : 'success'}
                      className='m-2'
                    >
                      {todo.done ? 'Mark as Undone' : 'Mark as Done'}
                    </Button>
                    <Button
                      onClick={() => handleDeleteTodo(todo._id)}
                      variant='danger'
                      className='m-2'
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Link href='/todos'>
            <Button className='mt-3'>View All To-Do Items</Button>
          </Link>
        </div>
      ) : (
        <Container className='text-center mt-5'>
          {/* Show sign-in button if the user is not signed in */}
          <p>Please log in to access your Todo List.</p>
          <SignInButton mode='modal'>
            <Button className='btn'>Sign in</Button>
          </SignInButton>
        </Container>
      )}
    </Container>
  );
}
