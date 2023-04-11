import Link from 'next/link';
import { Container, Card, Button } from 'react-bootstrap';

export default function Custom404() {
  return (
    <Container
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '100vh' }}
    >
      <Card className='text-center' style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title>
            <h1 className='p-3'>404 - Page Not Found</h1>
          </Card.Title>
          <Card.Text>The page you are looking for does not exist.</Card.Text>
          <Link href='/todos' passHref variant='primary'>
            Return to To-Do List
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}
