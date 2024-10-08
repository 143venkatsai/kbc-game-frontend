import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import "./index.css"

 

let socket;

function Player() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [question, setQuestion] = useState("Waiting for question...");
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    socket = io("https://kbc-game-backend-3zmw.onrender.com");

    socket.on('question', (data) => {
      setQuestion(`Q${data.questionNumber}: ${data.question}`);
      setResult('');
    });

    socket.on('result', (data) => {
      if (data.success) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ ${data.message}`);
      }
    });

    socket.on('end', (data) => {
      setQuestion(data.message);
      setResult('');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = () => {
    if (name.trim() === '') {
      alert('Please enter your name.');
      return;
    }
    socket.emit('join');
    setJoined(true);
  };

  const submitAnswer = () => {
    if (answer.trim() === '') {
      alert('Please enter an answer.');
      return;
    }
    socket.emit('answer', { name, answer });
    setAnswer('');
  };

  return (
    <div className='container'>
      <h1>KBC-Style Game - Player Interface</h1>
      {!joined ? (
        <div className='login'>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
          <button onClick={joinGame} className='btn'>Join Game</button>
        </div>
      ) : (
        <div className='container'>
          <div className='question'>{question}</div>
          <input
            type="text"
            placeholder="Your Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            
          />
          <button onClick={submitAnswer} className='btn' >Submit</button>
          {result && <div className='result'>{result}</div>}
        </div>
      )}
    </div>
  );
}

export default Player;
