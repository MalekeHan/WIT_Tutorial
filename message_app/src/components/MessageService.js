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