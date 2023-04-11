// pages/todo/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getTodoById, updateTodo } from '.././api/api-functions';
import { useAuth, openSignIn } from '@clerk/nextjs';
import {
  Form,
  Button,
  Card,
  Container,
  Col,
  Row,
  Alert,
} from 'react-bootstrap';

export default function TodoItem() {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState(null);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [jwt, setJwt] = useState('');
  // Redirect to home page if user is not signed in
  useEffect(() => {
    if (!isLoaded && !userId) {
      router.push('/');
    }
  }, [userId, isLoaded, router]);

  useEffect(() => {
    async function fetchTodo() {
      if (userId && id) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const fetchedTodo = await getTodoById(jwt, id);
        console.log('Fetched todos:', fetchedTodo);
        setTodo(fetchedTodo);
      }
    }
    fetchTodo();
  }, [userId, jwt, id]);

  const [updatedTodo, setUpdatedTodo] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (todo) {
      setUpdatedTodo(todo.title);
      setIsDone(todo.done);
      if (todo.category == null) {
        setUpdatedCategory('');
      } else {
        setUpdatedCategory(todo.category);
      }
      setUpdatedContent(todo.content);
    }
  }, [todo]);

  const handleSave = async () => {
    if (todo) {
      await updateTodo(
        jwt,
        userId,
        id,
        updatedTodo,
        updatedCategory,
        updatedContent,
        isDone
      );
    }
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
      {/* Check if the user is signed in before rendering the content */}
      {userId ? (
        <Container>
          <Row className='justify-content-md-center'>
            <Col md='auto'>
              <Card className='mt-5'>
                <Card.Header className='bg-primary text-white text-center'>
                  Edit To-Do Item
                </Card.Header>
                <Card.Body>
                  {!todo ? (
                    <Alert variant='info'>Loading...</Alert>
                  ) : (
                    <Form>
                      <Form.Group controlId='todoTitle'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={1}
                          value={updatedTodo}
                          onChange={(e) => setUpdatedTodo(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId='todoContent'>
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          value={updatedContent}
                          onChange={(e) => setUpdatedContent(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId='todoCategory'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={1}
                          value={updatedCategory}
                          onChange={(e) => setUpdatedCategory(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId='todoDone' className='mb-3'>
                        <Form.Check
                          type='checkbox'
                          label='Mark as done'
                          checked={isDone}
                          onChange={handleToggleDone}
                        />
                      </Form.Group>
                      <Button onClick={handleSave} className='btn btn-primary'>
                        Save
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
              <div className='text-center mt-3'>
                <Link href='/todos' className='btn btn-secondary'>
                  Back to To-Do List
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <div className='text-center mt-5'>
          <Alert variant='info'>
            Please log in to access your Todo List.
            <Button onClick={openSignIn} className='ml-3'>
              Log in
            </Button>
          </Alert>
        </div>
      )}
    </div>
  );
}
