'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toast } from "@/components/ui/toast"
import { Video, Users, Edit3, FileText, Send } from 'lucide-react'
import io from 'socket.io-client';
import axios from 'axios';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const socket = io('http://localhost:4000');

// Simulated video chat component
const VideoChat = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Simulating video stream
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getVideoStream();

    return () => {
      // Clean up the video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
    </div>
  );
}

// Shared whiteboard component
const Whiteboard = ({ roomName }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
  }, [color, brushSize]);

  useEffect(() => {
    socket.on('drawLine', (line) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.strokeStyle = line.color;
      context.lineWidth = line.brushSize;
      context.beginPath();
      context.moveTo(line.start.x, line.start.y);
      context.lineTo(line.end.x, line.end.y);
      context.stroke();
    });

    return () => {
      socket.off('drawLine');
    };
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  }

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();

    socket.emit('drawLine', {
      roomName,
      line: {
        start: { x: context.lastX, y: context.lastY },
        end: { x, y },
        color,
        brushSize
      }
    });

    context.lastX = x;
    context.lastY = y;
  }

  const endDrawing = () => {
    setIsDrawing(false);
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 p-1"
        />
        <Input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="w-32"
        />
        <Button onClick={clearCanvas}>Clear</Button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        className="border border-gray-300 rounded-lg"
      />
    </div>
  );
}

// Document collaboration component
const DocumentCollaboration = ({ roomName }) => {
  const [document, setDocument] = useState('');
  const [savedDocuments, setSavedDocuments] = useState([]);

  useEffect(() => {
    socket.on('documentUpdate', (content) => {
      setDocument(content);
    });

    return () => {
      socket.off('documentUpdate');
    };
  }, []);

  const updateDocument = (content) => {
    setDocument(content);
    socket.emit('updateDocument', { roomName, content });
  }

  const saveDocument = () => {
    if (document.trim() === '') return;
    setSavedDocuments([...savedDocuments, { id: Date.now(), content: document }]);
    setDocument('');
  }

  const loadDocument = (id) => {
    const loadedDoc = savedDocuments.find(doc => doc.id === id);
    if (loadedDoc) {
      setDocument(loadedDoc.content);
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-[300px] p-2 border border-gray-300 rounded-lg resize-none"
        value={document}
        onChange={(e) => updateDocument(e.target.value)}
        placeholder="Start typing your collaborative document here..."
      />
      <div className="flex justify-between">
        <Button onClick={saveDocument}>
          <FileText className="w-4 h-4 mr-2" />
          Save Document
        </Button>
        <select
          onChange={(e) => loadDocument(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">Load Document</option>
          {savedDocuments.map(doc => (
            <option key={doc.id} value={doc.id}>
              Document {doc.id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Chat component
const Chat = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const message = { text: newMessage, sender: 'You', timestamp: new Date() };
    socket.emit('sendMessage', { roomName, message });
    setMessages([...messages, message]);
    setNewMessage('');
  }

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-grow overflow-y-auto space-y-2 p-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg p-2 max-w-[70%] ${
                message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <p className="text-sm font-semibold">{message.sender}</p>
              <p>{message.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} className="ml-2">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function VirtualStudyRoomComponent({ partnerName }) {
  const [roomName, setRoomName] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const { toast } = useToast()

  const joinRoom = async () => {
    if (roomName.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a room name",
      })
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Add this line
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('http://localhost:4000/api/rooms', { roomName }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Server response:', response.data);

      socket.emit('joinRoom', roomName);
      setIsInRoom(true);
    } catch (error) {
      console.error('Error joining room:', error.response ? error.response.data : error.message);
      toast({
        title: "Error",
        description: error.response ? error.response.data.message : "Failed to join room",
        variant: "destructive",
      })
    }
  }

  const leaveRoom = () => {
    socket.emit('leaveRoom', roomName);
    setIsInRoom(false);
    setRoomName('');
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>Virtual Study Room {partnerName ? `with ${partnerName}` : ''}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isInRoom ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Enter Room Name</Label>
                <Input
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g., Math101_StudyGroup"
                />
              </div>
              <Button onClick={joinRoom}>Join Room</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Room: {roomName}</h2>
                <Button variant="outline" onClick={leaveRoom}>Leave Room</Button>
              </div>
              <Tabs defaultValue="video">
                <TabsList>
                  <TabsTrigger value="video">
                    <Video className="w-4 h-4 mr-2" />
                    Video Chat
                  </TabsTrigger>
                  <TabsTrigger value="whiteboard">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Whiteboard
                  </TabsTrigger>
                  <TabsTrigger value="document">
                    <FileText className="w-4 h-4 mr-2" />
                    Document
                  </TabsTrigger>
                  <TabsTrigger value="chat">
                    <Send className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="video">
                  <VideoChat />
                </TabsContent>
                <TabsContent value="whiteboard">
                  <Whiteboard roomName={roomName} />
                </TabsContent>
                <TabsContent value="document">
                  <DocumentCollaboration roomName={roomName} />
                </TabsContent>
                <TabsContent value="chat">
                  <Chat roomName={roomName} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}