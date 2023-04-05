// /*
//  * Auto generated Codehooks (c) example
//  * Install: npm i codehooks-js codehooks-crudlify
//  */
// import { app } from 'codehooks-js';
// import { crudlify } from 'codehooks-crudlify';

// // Define the schema for a Todo object using JSON Schema
// const todoSchemaJson = {
//   type: 'object',
//   properties: {
//     title: { type: 'string' }, // Todo title
//     category: { type: ['string', 'null'] }, // Todo category (optional)
//     done: { type: 'boolean', default: false }, // Todo completion status (default: false)
//     createdOn: {
//       type: 'string',
//       format: 'date-time',
//       default: new Date().toISOString(),
//     }, // Todo creation date (default: current date)
//   },
//   required: ['title'], // Specify required properties (id is not required here)
// };

// const options = {
//   // Specify the schema type as "jsonschema"
//   schema: 'jsonschema',
// };

// // Make REST API CRUD operations for the "todos" collection with the JSON Schema
// crudlify(app, { todos: todoSchemaJson }, options);

// // Export app to a runtime server engine
// export default app.init();
import { app } from 'codehooks-js';
import { crudlify } from 'codehooks-crudlify';
import * as yup from 'yup';

// Define the schema for a Todo object using Yup
const todoSchema = yup.object().shape({
  userId: yup.string().required('User ID is required'), // User ID
  title: yup.string().required('Todo title is required'), // Todo title
  content: yup.string().required('Todo content is required'), // Todo content
  category: yup.string().nullable(), // Todo category (optional)
  done: yup.boolean().default(false), // Todo completion status (default: false)
  createdOn: yup.mixed().default(() => new Date().toISOString()), // Todo creation date (default: current date)
});

const options = {
  // Specify the schema type as "yup"
  schema: 'yup',
};

// Make REST API CRUD operations for the "todos" collection with the Yup schema
crudlify(app, { todos: todoSchema }, options);

// Export app to a runtime server engine
export default app.init();
