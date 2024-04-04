import React, { useState } from 'react';
import MessageService from './components/MessageService'; // Ensure the path is correct based on your project structure

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
