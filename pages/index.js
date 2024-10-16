import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("username"); 
  const [messages, setMessages] = useState([]);
  const [message, setMessage] =useState("");

 const submit = async(e) => {
  e.preventDefault();


  const res = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        message
    }    ),
  });

  const data = await res.json();
  const timestamp = new Date().toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});
  console.log("受け取ったデータ:", data)

  setMessages((prevMessages) => [
  ...prevMessages,
  {sender: username, message, timestamp },
  {sender : "イロハ", 
    message: data.response.choices[0].message.content,
    model: data.response.model, 
    usage: data.response.usage
  },
]); 
  setMessage("");
};

const playVoice = async (message) => {
  try {
    const response = await fetch("http://localhost:8000/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      })
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    }
    catch(error) {
      console.log("音声の再生に失敗しました", error);
    }
};

  return (
    <div style={{
    backgroundImage: "url('/bg/fireplace.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh'
  }}>
      <Head>
        <title>ChatRoom</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
      </Head>
      <div className="container d-flex flex-column aligh-items-stretch flex-shrink-0" style={{
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
        padding: '20px',
        borderRadius: '10px',
        border: 'none',
        boxShadow:'none'
      }} >

        <div className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom" style={{
          borderBottom: 'none'
        }}>
                <input className="fs-5 fw-semibold" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="ユーザー名を入力"/>
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea" style={{minHeight: "500px",
          border: 'none',
          boxShadow: 'none'
        }}>
          {messages.map((message, index) => (
              <div key={index} className="list-group-item list-group-item-action py-3 lh-sm" style={{
                backgroundColor: '#444444',
                color: '#d2691e',
                borderRadius: '5px',
                marginBottom: '10px',
                border: 'none'
              }}>
                  <div className="d-flex">
                    <div className="me-3">
                      {message.sender === "イロハ" ? (
                        <div className="d-flex flex-column aligh-items-center">
                        <img src= "iroha.png" alt="AI Avatar" className="rounded-circle me-2" style={{width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                        /> 
                        <button
                        className="btn btn-primary mt-2"
                        onClick={() => playVoice(message.message)}
                        style={{fontSize: "12px", padding:"5px 10px"}}
                        >
                          こえ</button>
                      </div>
                      ) : (
                        <img src="/usericon.png"
                        alt="UserAvatar"
                        className="rounded-circle"
                        style={{
                          width:"40px",
                          height:"40px",
                          borderRadius:"50%",
                          objectFit:"cover",
                        }}
                        />
                      )}
                    </div>
                    <div className="flex-grow-1">  
                      <strong className="mb-1">{message.sender}</strong>
                      <div className="small">{message.message}</div>
                      {message.sender === "イロハ" && (
                        <div className="small mt-1" style={{ color: "#191970"}}>
                          <div>Model: {message.model}</div>
                          <div>Usage: {message.usage.total_tokens} tokens </div>
                        </div>
                      )}
                      
                  </div>
                  <div className="text-muted-small" style={{
                    whiteSpace: 'nowrap'}}>
                      {message.timestamp}
                  </div>
                  </div>
                </div>
          ))}
        </div>
        </div>
        <div className="container">
        <form onSubmit={submit}>
                  <input className="form-control" placeholder="Write a message" value={message}
                  onChange={e => setMessage(e.target.value)}
                  />
                </form>
        </div>

    </div>
  );
}
