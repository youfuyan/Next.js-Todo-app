// pages/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// React backend API endpoint and API token

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
    </div>
  );
}
