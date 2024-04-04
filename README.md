# Django Backend for React Frontend Tutorial


## Prerequisites for Backend
- Python 3.x installed on your system
- Basic knowledge of Python
- Download [Postman](https://www.postman.com/downloads/)

### Create Virtual Environment
WINDOWS: env\Scripts\activate
LINUX/MacOS: source env/bin/activate

### Installing Dependancies
`pip install django djangorestframework`

### Creating Django Project
`django-admin startproject tutorial`

`cd tutorial`

### Creating Django App
`python manage.py startapp api`

### Define A Model
Inside of `api/models.py` define a `Message` model
```
class Message(models.Model):
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text
```
### CORS
`pip install django-cors-headers`

`'corsheaders.middleware.CorsMiddleware', `

`CORS_ALLOW_ALL_ORIGINS = True`

### Run application
`python manage.py makemigrations `

`python manage.py migrate   `

`python manage.py runserver `

## Front end
[Install node](https://nodejs.org/en)
 
## Create react application
`npx create-react-app message_app`

`cd message_app`

### Install axios
`npm install axios`

### Create MessageService Component
- Create new folder in `src` directory named `components`
- Create `MessageService.js`
- Add the following:
  ```
  import axios from 'axios';
  
  const API_URL = 'http://localhost:8000/api/messages/';
  
  class MessageService {
    // Get all messages
    getMessages() {
      return axios.get(API_URL);
    }
  
    // Create a new message
    createMessage(text) {
      return axios.post(API_URL, { text });
    }
  
    // Get a specific message by ID
    getMessage(id) {
      return axios.get(`${API_URL}${id}/`);
    }
  
    // Delete a message by ID
    deleteMessage(id) {
      return axios.delete(`${API_URL}${id}/delete/`);
    }
  }
  
  export default new MessageService();
  ```

### Modify `App.js`
  ```
    import React, { useState } from 'react';
import MessageService from './components/MessageService'; 

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Modified to not immediately invoke on component mount
  const fetchMessages = () => {
    MessageService.getMessages()
      .then(response => {
        // Include `id` alongside `fields` data
        const messagesData = response.data.map(item => ({ ...item.fields, id: item.pk }));
        setMessages(messagesData);
      })
      .catch(e => console.log(e));
  };

  const handleCreateMessage = () => {
    if (!newMessage) return;
    MessageService.createMessage(newMessage)
      .then(() => {
        fetchMessages(); // Fetch all messages to refresh the list
        setNewMessage(""); // Clear input after message creation
      })
      .catch(e => console.log(e));
  };

  const handleDeleteMessage = (id) => {
    MessageService.deleteMessage(id)
      .then(() => {
        fetchMessages(); // Re-fetch messages to update the list after deletion
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="container mt-5" style={{ color: "#EEE" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="New message" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-primary" onClick={handleCreateMessage}>Add Message</button>
              <button className="btn btn-outline-info" onClick={fetchMessages}>Fetch Messages</button>
            </div>
          </div>
          <ul className="list-group">
            {messages.map((message) => (
              <li key={message.id} className="list-group-item" style={{ backgroundColor: "#333", color: "#EEE" }}>
                {message.text}
                <button className="btn btn-danger float-right" onClick={() => handleDeleteMessage(message.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

  ```

### Modify `public/index.html` to use `Bootstrap`
` <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> `

### Run the React App
`npm start`

## Local Deployment
### Setup
- While in the react app directory run `npm run build`
- Look for the created `build` folder
- Create a folder in the root of the Django app called `frontend`
- Copy the build folder into this folder

### Serving the files
- Add the following to our `settings.py`
```
import os
from pathlib import Path

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend/build/static'),  # we want to serve our static files for the backend
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # For collectstatic to use in production
```

- Create a new view in `views.py` to actually do the logic to serve the file
  ```
  def index(request):
    return render(request, 'index.html')  # render our index.html file
  ```

- Make sure the logic happens to serve the file on all routes
 ```
  from django.urls import path, re_path
  from django.views.generic import TemplateView
 ```
 NOTE: THIS LINE MUST BE UNDER ALL OTHER VIEWS:
 ` re_path('.*', views.index),`

