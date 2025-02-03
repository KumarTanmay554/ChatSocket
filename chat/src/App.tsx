import { useEffect, useState } from "react";
import './App.css'

export default function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(()=>{
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = ()=>{
      console.log("hoo ah");
      setSocket(socket)
    }
    socket.onmessage = (event) =>{
      console.log("recieved message", event.data);
      if (event.data !== "Hello! Message From Server!!") {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    }

    return ()=>{
      socket.close();
    }
  },[])

  if(!socket) return <div className="loading-container">
    <div className="spinner"></div>
    <div>Connecting...</div>
  </div>
  return(
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">{message}</div>
          ))}
        </div>
        <div className="input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={() => {
              socket.send(input);
              setInput('');
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}