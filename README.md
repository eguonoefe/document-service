## Document Management System

Document Management System provides a restful API for users to create and manage documents giving different privileges based on user roles and managing authentication using JWT.

## API Documentation
The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.
## API Summary
View full API documentation [here](https://doc-ninja.herokuapp.com/api-docs)

#### API Features

The following features make up the Document Management System API:

###### Authentication

- It uses JSON Web Token (JWT) for authentication
- It generates a token on successful login or account creation and returns it to the user
- It verifies the token to ensure a user is authenticated to access every endpoints

###### Users

- It allows users to be created  
- It allows users to login and obtain a unique token which expires every 12hours
- It allows authenticated users to retrieve and update their information 
- It allows users to retrieve their documents based on userId
- It allows the admin to manage users

###### Roles

- It ensures roles can be created, retrieved, updated and deleted by an admin user
- A non-admin cannot access this endpoint
- A non-admin user cannot create, retrieve, modify, or delete roles

###### Documents

- It allows new documents to be created by authenticated users 
- It ensures all documents are accessible based on the permission/priviledges 
- It allows admin users to create, retrieve, modify, and delete documents
- It ensures users can retrieve, edit and delete documents that they own  
- It allows users to retrieve all documents they own as well as public documents
- It allows users to retrieve all public documents
- It allows users on the same role to retrieve role-based documents

###### Search

- It allows admin to retrieve all documents that matches search term
- It allows admin to search users based on a specified search term
- It allows users to search public documents for a specified search term
- It allows users to search for users through name or email address
- It allows users on the same role to search through role-based documents 

## Technologies Used
- **[JavaScript ES6](http://es6-features.org/)** - Codes were written in javascript to enhance HTML pages.
- **[NodeJS](https://nodejs.org/)** - Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.
- **[ExpressJS](https://expressjs.com/)** - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. I used this framework for routing.
- **[PostgreSQL](https://www.postgresql.org/)** - Postgres is an object-relational database management system (ORDBMS) with an emphasis on extensibility and standards compliance.
- **[Sequelize](http://docs.sequelizejs.com/)** - Sequelize is a promise-based ORM for Node.js which supports the dialects of PostgreSQL and features solid transaction support, relations, read replication and more.

### **Installation Steps**
* Ensure you have `node` installed or install [Node](https://nodejs.org/en/download/)
* Clone the project repository from your terminal `git clone https://github.com/andela-eefekemo/kudos-dms-api.git`
* Change directory into the `kudos-dms-api` directory
* Run `npm install` to install the dependencies in the `package.json` file
* Run `npm run dev` to start the project
* Run `npm test` to run the api tests
* Use [Postman](https://www.getpostman.com/) or any API testing tool of your choice to access the endpoints

### **Endpoints**
**N/B:** For all endpoints that require authentication, use \
`Authorization: <token>`

#### Limitations:
The limitations to the **Document Management System API** are as follows:
* Users can only create plain textual documents and retrieve same when needed 
* Users cannot share documents with people, but can make document `public` to make it available to other users
* Users login and obtain a token which is verified on every request, but users cannot logout (nullify the token), however tokens become invalid when it expires

### How to Contribute
Contributors are welcome to further enhance the features of this API by contributing to its development. The following guidelines should guide you in contributing to this project:

1. Fork the repository.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request describing the feature(s) you have added

Ensure your codes follow the [AirBnB Javascript Styles Guide](https://github.com/airbnb/javascript)
