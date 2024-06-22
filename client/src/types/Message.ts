// Define the main interface for the Post document
interface IMessage  {
    sender: string; // Reference to the User who sends the message
    receiver: string; // Reference to the User who receives the message
    content: string; // Content of the message
    createdAt: Date; // Timestamp when the message was created
}

export default IMessage;