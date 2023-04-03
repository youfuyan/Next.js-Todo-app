// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// React backend API endpoint and API token
const API_ENDPOINT = 'https://api-zwsy.api.codehooks.io/dev/hello';
const API_KEY = '6e12d9d2-9c03-4795-86e6-780588a7d8b2';
// React backend API endpoint and API token
// const API_ENDPOINT = 'https://reactback-nyly.api.codehooks.io/dev/hello';
// const API_KEY = 'a4679c85-b4c8-49fb-b8ac-63230b269dd7';

// Mock authentication check
const isAuthenticated = () => {
  //implement a proper authentication check with Google Authentication
  return false; // If the user is authenticated, return true
};

export default function Home() {
  const router = useRouter();
  // Application state variables
  const [visits, setVisits] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Call Codehooks backend API
    const fetchData = async () => {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: { 'x-apikey': API_KEY },
      });
      const data = await response.json();
      // Change application state and reload
      setMessage(data.message);
      setVisits(data.visits);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/todos');
    }
  }, []);

  return (
    <div>
      <h1>My To-Do App</h1>
      {/* Implement login functionality with Google Authentication */}
      <button onClick={() => alert('Login with Google')}>
        Login with Google
      </button>
      <h2 style={{ height: '50px' }} className='heading'>
        {message || ''}
      </h2>
      <p>Visitors: {visits || '---'}</p>
    </div>
  );
}
