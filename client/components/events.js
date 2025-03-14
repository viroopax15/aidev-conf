import mitt from "mitt";

const emitter = mitt();
emitter.allEvents = [];

// Send client events over the data channel
emitter.emitClient = (eventType, message) => {
  if (emitter.dataChannel) {
    message.event_id = message.event_id || crypto.randomUUID();
    message.type = eventType;
    dataChannel.send(JSON.stringify(message));
    emitter.emit(eventType, message);
  } else {
    console.error(
      "Failed to send message - no data channel available",
      message,
    );
  }
};

// Send text messages
emitter.emitText = (text) => {
  emitter.emitClient({
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: message,
        },
      ],
    },
  });
  emitter.emitClient("response.create");
};

emitter.on("*", (type, message) => {
  emitter.allEvents.unshift(message);
});

export default emitter;
