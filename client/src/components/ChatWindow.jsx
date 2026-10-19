function ChatWindow({ messages }) {
  return (
    <div className="bg-white h-[500px] overflow-y-auto rounded-2xl border border-ink/5 shadow-sm p-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
              message.sender === "user"
                ? "bg-brand text-white"
                : "bg-bg-soft text-ink"
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
