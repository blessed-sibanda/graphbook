import { gql, useQuery } from "@apollo/client";
import React from "react";

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        avatar
        username
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

const Chat = (props) => {
  const { chatId, closeChat } = props;
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
  });
  if (loading)
    return (
      <div className="chatWindow">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="chatWindow">
        <p>{error.message}</p>
      </div>
    );
  const { chat } = data;
  return (
    <div className="chatWindow">
      <div className="header">
        <span>{chat.users[1].username}</span>
        <button onClick={() => closeChat(chatId)} className="close">
          &times;
        </button>
      </div>
      <div className="messages">
        {chat.messages.map((message, j) => (
          <div
            className={"message " + (message.user.id > 1 ? "left" : "right")}
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
