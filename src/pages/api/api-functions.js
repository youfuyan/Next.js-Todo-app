const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

async function createTodo(token, userId, title, category, content) {
  try {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json', // Ensure the Content-Type header is set
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
      body: JSON.stringify({
        userId: userId,
        title,
        category,
        content,
        done: false,
      }),
    });

    // Check if the response status code indicates success
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating todo:', errorData);
      // Throw an error to handle it in the calling function (optional)
      throw new Error('Failed to create todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createTodo function:', error);
    throw error; // Propagate the error to the calling function (optional)
  }
}

async function getAllTodos(token, userId) {
  const response = await fetch(`${API_BASE}/todos?userId=${userId}`, {
    headers: {
      'x-api-key': API_KEY,
      Authorization: `Bearer ${token}`, // Add the JWT token to the request header
    },
  });
  return await response.json();
}

async function getTodoById(token, id) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    headers: {
      'x-api-key': API_KEY,
      Authorization: `Bearer ${token}`, // Add the JWT token to the request header
    },
  });
  return await response.json();
}

async function updateTodo(token, userId, id, title, category, content, done) {
  try {
    // Check if the 'id' parameter is defined
    if (!id) {
      throw new Error('Todo ID is required for updating');
    }
    const createdOn = new Date().toISOString(); // Get the current date and time
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
      body: JSON.stringify({
        userId: userId,
        title: title,
        category: category,
        content: content,
        done: done,
        createdOn: createdOn,
      }),
    });

    // Check if the response status code indicates success
    if (!response.ok) {
      // Check if the response has a JSON body
      const contentType = response.headers.get('content-type');
      let errorData;
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
      console.error('Error updating todo:', errorData);
      throw new Error('Failed to update todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateTodo function:', error);
    throw error;
  }
}

async function deleteTodo(token, id) {
  try {
    // Check if the 'id' parameter is defined
    if (!id) {
      throw new Error('Todo ID is required for updating');
    }
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
    });

    // Check if the response status code indicates success
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error deleting todo:', errorData);
      throw new Error('Failed to delete todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteTodo function:', error);
    throw error;
  }
}

async function markTodoAsDone(token, id) {
  try {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the JWT token to the request header
      },
      body: JSON.stringify({ done: true }),
    });
    // Check if the response status code indicates success
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error marking todo as done:', errorData);
      throw new Error('Failed to mark todo as done');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in markTodoAsDone function:', error);
    throw error;
  }
}

async function getTodosByCategory(token, userId, category) {
  try {
    const response = await fetch(
      `${API_BASE}/todos?userId=${userId}&category=${category}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching todos by category:', errorData);
      throw new Error('Failed to fetch todos by category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getTodosByCategory function:', error);
    throw error;
  }
}

export {
  createTodo,
  getAllTodos,
  getTodoById,
  getTodosByCategory,
  updateTodo,
  deleteTodo,
  markTodoAsDone,
};
