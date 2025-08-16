import { createContext, useContext, useState } from "react";

const AppContext = createContext();
// {
//     state: "",
//     message: "",
//   }

export const AppProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const updateMessage = (id, message) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, ...message } : msg))
    );
  };
  const removeMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };
  return (
    <AppContext.Provider
      value={{ messages, addMessage, updateMessage, removeMessage }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
