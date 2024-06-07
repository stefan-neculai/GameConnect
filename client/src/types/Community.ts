// Define an interface for the Community object
interface ICommunity {
    _id: string; // MongoDB ID
    name: string;
    description: string;
    createdAt: Date;
    members: string[]; // Array of user IDs
    moderators: string[]; // Array of user IDs
    relatedGame?: string; // Optional reference to a game ID if type is 'game'
    communityIcon: string; // URL for the community icon
  }
  
  export default ICommunity;
  