import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

export const Chat = () => {
  const users = useLoaderData();
  console.log(users);
  const [reciever, setReciever] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "30%",
          borderRight: "1px solid black",
          height: "700px",
        }}
      >
        {" "}
        {users.map((el) => (
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
        <div></div>
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="write here"
            style={{
              border: "1px solid gray",
              borderRadius: "8px",
              width: "70%",
            }}
          />
          <button
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
