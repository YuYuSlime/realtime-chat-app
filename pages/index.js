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

  setMessages((prevMessages) => [
  ...prevMessages,
  {sender: username, message },
  {sender : "AI", message: data.response },
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
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">{message.sender}</strong>
            </div>
            <div className="col-10 mb-1 small">{message.message}</div>
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
