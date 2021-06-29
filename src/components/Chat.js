import { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";
import { handleSubmit, fetchData, generateID } from "../functions/functions";
import "../styles/chat.css";

/**
 * @component
 * Chat component
 */

function Chat() {
  const [fetchedMessages, setFetchedMessages] = useState("");
  const [text, setText] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(true);
  const chatBox = useRef();

  useEffect(() => {
    if (localStorage.getItem("userID") === null) {
      localStorage.setItem("userID", generateID(6));
    }

    fetchData(db, chatBox, setFetchedMessages, setText, setMessagesLoading);
  }, []);

  return (
    <div className="main">
      <div ref={chatBox} className="messages">
        {fetchedMessages &&
          fetchedMessages.map((mes) => {
            return (
              <div
                className={
                  (localStorage.getItem("userID") === mes.userID
                    ? "user "
                    : "") +
                  "message" +
                  (messagesLoading ? " loading" : "")
                }
                key={mes.timestamp}
              >
                {mes.content}
              </div>
            );
          })}
      </div>

      <div className="inputfooter">
        <textarea
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey)
              handleSubmit(e, text, db, chatBox);
          }}
          placeholder="Message"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
          className="input_message"
          type="text"
        />

        <button
          onPointerDown={(e) => {
            handleSubmit(e, text, db, chatBox);
          }}
          className="submit_button"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
