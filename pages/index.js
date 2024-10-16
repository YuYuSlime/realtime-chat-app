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
  console.log("受け取ったデータ:", data)

  setMessages((prevMessages) => [
  ...prevMessages,
  {sender: username, message },
  {sender : "AI", 
    message: data.response.choices[0].message.content,
    model: data.response.model, 
    usage: data.response.usage
  },
]); 
  setMessage("");
};

  return (
    <div className="container">
      <Head>
        <title>ChatRoom</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"/>
      </Head>
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-info" >

        <div className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
                <input className="fs-5 fw-semibold" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="ユーザー名を入力"/>
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea" style={{minHeight: "500px"}}>
          {messages.map((message, index) => (
              <div key={index} className="list-group-item list-group-item-action py-3 lh-sm">
                  <div className="d-flex">
                    <div className="me-3">
                      {message.sender === "AI" ? (
                        <img src= "/1707458087229-6YZqPu0Esy.png" alt="AI Avatar" className="rounded-circle me-2" style={{width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}/> 
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
                      {message.sender === "AI" && (
                        <div className="small mt-1" style={{ color: "red"}}>
                          <div>Model: {message.model}</div>
                          <div>Usage: {message.usage.total_tokens} tokens </div>
                        </div>
                      )}
                      
                  </div>
                  </div>
                </div>
          ))}
        </div>
        </div>

        <form onSubmit={submit}>
          <input className="form-control" placeholder="Write a message" value={message}
          onChange={e => setMessage(e.target.value)}
          />
        </form>
    </div>
  );
}
