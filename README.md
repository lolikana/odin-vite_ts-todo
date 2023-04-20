# The Odin Project - FullStack JS Path

## Todo app

This is a Todo app built with Vitejs, TypeScript vanilla, Express, and MongoDB for The Odin Project's JavaScript curriculum. 
The app allows users to add, view, edit, and delete tasks, as well as mark tasks as completed.

## Technologies 
The project uses the following technologies:

* HTML
* SCSS
* TypeScript
* Vitejs - a build tool and development server for modern web apps
* Express - a web application framework for Node.js
* MongoDB - a NoSQL document-oriented database

## Features
- [x] User can add new labels 
- [ ] User can add new tasks with a title and description
- [ ] User can view a list of all tasks
- [ ] User can edit a task's title and description
- [ ] User can mark a task as completed or not completed
- [ ] User can delete a task

## Getting Started
### Locally
To run this app locally, follow these steps:

1. Clone this repository to your local machine:

```
git clone https://github.com/lolikana/odin-vite_ts-todo.git
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

4. In a different terminal, start the Vite development app:

```
npm run vite
```

5. Navigate to http://localhost:3000 in your browser.

### Production
1. Clone this repository to your local machine:

```
git clone https://github.com/lolikana/odin-vite_ts-todo.git
```

2. Install dependencies:

```
npm install
```

3. Create ```.env``` file  in the root of folder ./:

```
VITE_MONGODB_URI='mongodb+srv://<username>:<password>@cluster0.5yj73eu.mongodb.net/<collection>?retryWrites=true&w=majority'
VITE_MONGODB_DB=<collection>

VITE_PORT=<port !== 3000>
VITE_PATH='http://localhost:'
VITE_API_LABELS="/api/labels"
```

4. Build and Start the production mode:

```
npm run preview
```

5. Navigate to http://localhost: ```<port>``` in your browser.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Credits
This app was built as part of The Odin Project's JavaScript curriculum.
Special thanks to Vitejs, TypeScript, Express, and MongoDB for making the development of this app possible.
