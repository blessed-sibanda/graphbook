import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ADD_MESSAGE } from "./apollo/mutations/addMessage";
import { GET_CHAT } from "./apollo/queries/getChat";
import Error from "./components/error";
import Loading from "./components/loading";

const Chat = (props) => {
  const { chatId, closeChat } = props;
  const { loading, error, data } = useQuery(GET_CHAT, {
    variables: { chatId },
  });
  const [text, setText] = useState("");
  const [addMessage] = useMutation(ADD_MESSAGE, {
    update(cache, { data: { addMessage } }) {
      cache.modify({
        id: cache.identify(data.chat),
        fields: {
          messages(existingMessages = []) {
            const newMessageRef = cache.writeFragment({
              data: addMessage,
              fragment: gql`
                fragment NewMessage on Chat {
                  id
                  type
                }
              `,
            });
            return [...existingMessages, newMessageRef];
          },
        },
      });
    },
  });

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && text.length) {
      addMessage({ variables: { message: { text, chatId } } }).then(() =>
        setText("")
      );
    }
  };
  if (loading)
    return (
      <div className="chatWindow">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="chatWindow">
        <Error>
          <p>{error.message}</p>
        </Error>
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
            key={"message" + message.id}
            className={"message " + (message.user.id > 1 ? "left" : "right")}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Chat;
