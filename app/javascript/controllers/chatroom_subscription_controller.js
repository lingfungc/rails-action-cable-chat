import { Controller } from "@hotwired/stimulus";
import { createConsumer } from "@rails/actioncable";

// Connects to data-controller="chatroom-subscription"
export default class extends Controller {
  static values = { chatroomId: Number };
  static targets = ["messages"];

  connect() {
    console.log(
      `Subscribe to the chatroom with the id ${this.chatroomIdValue}.`
    );

    // * Create a Subscription to this controller channel with Action Cable
    this.channel = createConsumer().subscriptions.create(
      // * Connect this Chatroom Subscriptions Controller to Chatroom Channel and Pass the Chatroom ID to there
      { channel: "ChatroomChannel", id: this.chatroomIdValue },
      // * This Data is from ChatroomChannel.broadcast_to() in Messages Controller
      { received: (data) => this.#insertMessageAndScrollDown(data) }
    );

    console.log(this.channel);
  }

  // * This # Indicates Private Method
  #insertMessageAndScrollDown(data) {
    this.messagesTarget.insertAdjacentHTML("beforeend", data);
    // * The Arguments are x-axis and y-axis
    this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
  }

  // * When this Chatroom Subscriptions Controller is Disconnected from the Browser
  disconnect() {
    console.log("Unsubscribed from the chatroom");
    this.channel.unsubscribe();
  }

  resetForm(event) {
    event.target.reset();
  }
}
