import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from '@clerk/nextjs';
import styles from '../styles/Home.module.css';
import { Container, Card, Button } from 'react-bootstrap';

function Header() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Redirect to '/todos' page after 2.5 seconds
    if (user) {
      const timer = setTimeout(() => {
        router.push('/todos');
      }, 2500);
      return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
    }
  }, [user, router]);

  return (
    <Container className='d-flex flex-column justify-content-center align-items-center mt-5'>
      <h1 className={styles.fadeInOut}>CSCI5117 Todo List</h1>
      <Card className='mt-3 text-center' style={{ width: '30rem' }}>
        <Card.Body>
          <SignedIn>
            <p className={styles.fadeInOut}>Welcome, {user?.firstName}!</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <UserButton />
            </div>
            <Card.Text className='mt-2'>
              Now directing you to your ToDo List
            </Card.Text>
            <Link href='/todos'>
              <Button variant='primary'>Go to ToDo List</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <p className={styles.fadeInOut}>
              Please log in to access your Todo List.
            </p>
            <SignInButton className='btn btn-primary m-3' />
          </SignedOut>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Header />
      <footer
        style={{ marginTop: 'auto', padding: '16px', textAlign: 'center' }}
      >
        &copy; {new Date().getFullYear()} By Youfu
      </footer>
    </div>
  );
}
