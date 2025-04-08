import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const Chat = () => {
  const [user, setUser] = useState(null);
  const users = useLoaderData();
  console.log(users);
  const [reciever, setReciever] = useState(null);
  const [messages, setMessages] = useState([]);
  const { revalidate } = useRevalidator();
  console.log(messages);

  const getCurrent = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/profile", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data);
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getCurrent();
    console.log("useffect");
  }, []);

  const getMessage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/auth/message/${user?._id}/${reciever}`
      );
      console.log(response.data);
      setMessages(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessage();
  }, [reciever]);

  useEffect(() => {
    if (user) {
      socket.emit("setuser", user._id);
    }

    socket.on("recievemessage", (data) => {
      console.log(data);
      if (data.recieverID && data.senderID) {
        setMessages((prev) => [...prev, data]);
        console.log("new list of messages", messages);
      }
    });
    return () => {
      socket.off("recievemessage");
    };
  }, [reciever]);

  const inputRef = useRef();
  const endRef = useRef();
  const handleSubmit = () => {
    if (inputRef.current.value) {
      socket.emit("sendmessage", {
        senderID: user._id,
        recieverID: reciever,
        text: inputRef.current.value,
      });
    }
    setMessages((prev) => [
      ...prev,
      {
        senderID: user._id,
        recieverID: reciever,
        text: inputRef.current.value,
      },
    ]);
  };

  const scroll = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scroll();
  }, [messages]);

  return (
    <div style={{ display: "flex", overflowY: "hidden", height: "100%" }}>
      <div
        style={{
          width: "30%",
          borderRight: "1px solid black",
          height: "700px",
        }}
      >
        {" "}
        {users
          .filter((el) => el._id !== user?._id)
          .map((el) => (
            <div
              onClick={() => setReciever(el._id)}
              style={{ display: "flex", alignItems: "center", gap: "2rem" }}
            >
              <img
                style={{ borderRadius: "50%" }}
                src={el.picture}
                alt="error"
                referrerpolicy="no-referrer"
              />
              <span> {el.fullName} </span>
            </div>
          ))}{" "}
      </div>
      <div style={{ width: "70%", position: "relative" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            height: "650px",
          }}
        >
          {messages?.map((el) => (
            <h1
              style={{
                alignSelf: user._id !== el.senderID ? "start" : "end",
                backgroundColor: user._id === el.senderID ? "blue" : "gray",
                color: "white",
                borderRadius: "16px",
                width: "40%",
                margin: "10px",
                padding: "3px 8px",
              }}
            >
              {" "}
              {el.text}{" "}
            </h1>
          ))}
          <div ref={endRef} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",

            width: "100%",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="write here"
            style={{
              border: "1px solid gray",
              borderRadius: "8px",
              width: "70%",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "5px",
              borderRadius: "8px",
              marginLeft: "50px",
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};
