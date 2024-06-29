import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { LillyDocumentDetect } from './components/LillyDocumentDetect/LillyDocumentDetect.tsx';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);


  function makeAPICall() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }) // Replace with the data you want to send
    };
  
    fetch('/api/report', requestOptions) // Replace '/api/route' with your actual Flask route
      .then(response => response.json())
      .then(data => {
        // Handle the response data here
        console.log(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }
  
  useEffect(() => {     
    // Fetch initial message when the component mounts
    fetchMessage('Hello myGPT!');
  }, []);

  const fetchMessage = async (message) => {
    setLoading(true);

    // Make a POST request to the backend endpoint
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Update the messages with the received response
    const updatedMessages = [
      ...messages,
      { content: message, sender: 'user', id: messages.length },
      { content: data.response, sender: 'bot', id: messages.length + 1 },
    ];
    setMessages(updatedMessages);

    setInputValue('');
    setLoading(false);
    scrollToBottom();
  };


  const handleMessageChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue.trim() === '') {
      return;
    }

    // Fetch response when the user sends a message
    await fetchMessage(inputValue);
  };

  const scrollToBottom = () => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <Router>
      <Routes>
        <Route path="/lilly-documentDetect" element={<LillyDocumentDetect />} />
      </Routes>
    </Router>
  );
}

export default App;
