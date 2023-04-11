import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, openSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/router';
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

export default function Done() {
  const [doneTodos, setDoneTodos] = useState([]);
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
    const fetchDoneTodos = async () => {
      if (userId) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const todos = await getAllTodos(jwt, userId);
        const doneItems = todos.filter((todo) => todo.done);
        setDoneTodos(doneItems);
      }
    };
    fetchDoneTodos();
  }, [userId, jwt]);

  const handleDeleteTodo = async (_id) => {
    console.log('Deleting todo with id:', _id); //to log the id value
    await deleteTodo(jwt, _id);
    setDoneTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
  };

  const handleUpdateTodo = async (_id) => {
    const todoToUpdate = doneTodos.find((todo) => todo._id === _id);
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
      setDoneTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === _id ? updatedTodo : todo))
      );
    }
  };
  const doneItems = doneTodos.filter((todo) => todo.done);
  return (
    <div>
      {/* Check if the user is signed in before rendering the content */}
      {userId ? (
        <div>
          <h1>Done Items</h1>
          <div className='contentContainer' style={{ display: 'flex' }}>
            <ul>
              {doneItems.map((todo) => (
                <li
                  key={todo._id}
                  className='list-group-item d-flex justify-content-between align-items-center'
                >
                  <div>
                    <Link
                      href={`/todo/${todo._id}`}
                      style={{ textDecoration: 'line-through' }}
                    >
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
                    {doneTodos.done && <span className='ml-2'>Done</span>}

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
          </div>
          <div className='contentContainer'>
            <Link href='/todos'>Back to To-Do List</Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Show sign-in button if the user is not signed in */}
          <p>Please log in to access your Todo List.</p>
          <Button onClick={openSignIn}>Log in</Button>
        </div>
      )}
    </div>
  );
}
