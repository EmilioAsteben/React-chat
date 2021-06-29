/**
 * @typedef {function} setState
 * @typedef {object} ref
 */

/**
 * Sends messages to the database
 * @param {SyntheticEvent} event      The react `SyntheticEvent`
 * @param {string} text               Message input value (from `state`)
 * @param {object} db                 Database imported from `firebase`
 * @param {object} chatBox            Main chat window
 */
async function handleSubmit(event, text, db, chatBox) {
  event.preventDefault();
  if (text.length === 0) return;
  try {
    await db.ref("messages").push({
      userID: localStorage.getItem("userID"),
      content: text,
      timestamp: Date.now(),
    });

    chatBox.current.childNodes[chatBox.current.childNodes.length - 1] &&
      chatBox.current.childNodes[
        chatBox.current.childNodes.length - 1
      ].scrollIntoView({ block: "center", behavior: "smooth" });
  } catch (error) {
    alert(error);
  }
}

/**
 * Fetches messages from the database
 * 
 * @param {object}    db                     Database imported from `firebase`
 * @param {ref}       chatBox                `Ref` to chat container
 * @param {setState}  setFetchedMessages     Puts the fethced messages into the state
 * @param {setState}  setText                Controls message input
 * @param {setState}  setMessagesLoading     Toggles classes to animate the first load 

 */

function fetchData(
  db,
  chatBox,
  setFetchedMessages,
  setText,
  setMessagesLoading
) {
  try {
    db.ref("messages").on("value", (data) => {
      let messages = [];
      data.forEach((message) => {
        messages.push(message.val());
      });
      setFetchedMessages(messages);
      setText("");

      setTimeout(() => {
        setMessagesLoading(false);
      }, 300);

      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    });
  } catch (error) {
    alert(error);
  }
}

/**
 * Generates a userID to identify a user
 * @param   {number} length - length of userID
 * @returns {string}  generated userID with set length.
 * @example
 * let IdLength = 4;
 *
 * let userID = generateID(idLength); // userID is a four-character string
 */
function generateID(length) {
  /**
   * @type {string}
   */
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { handleSubmit, fetchData, generateID };
