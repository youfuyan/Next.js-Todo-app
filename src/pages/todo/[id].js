// pages/todo/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getTodoById, updateTodo } from '.././api/api-functions';

export default function TodoItem() {
  const router = useRouter();
  const { id } = router.query;
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    async function fetchTodo() {
      if (id) {
        const fetchedTodo = await getTodoById(id);
        setTodo(fetchedTodo);
      }
    }
    fetchTodo();
  }, [id]);

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
      <h1>Edit To-Do Item</h1>
      <h2>Title</h2>
      <textarea
        value={updatedTodo}
        onChange={(e) => setUpdatedTodo(e.target.value)}
      />
      <h2>Content</h2>
      <textarea
        value={updatedContent}
        onChange={(e) => setUpdatedContent(e.target.value)}
      />
      <h2>Category</h2>
      <textarea
        value={updatedCategory}
        onChange={(e) => setUpdatedCategory(e.target.value)}
      />
      <br />
      <input
        type='checkbox'
        checked={isDone}
        onChange={handleToggleDone}
      />{' '}
      Mark as done
      <br />
      <button onClick={handleSave} className='btn btn-primary m-3'>
        Save
      </button>
      <br />
      <Link href='/todos'>Back to To-Do List</Link>
    </div>
  );
}
