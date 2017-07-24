var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL shcema language
var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

   type Query {
       hello:String
       rollDice(numDice: Int!, numSides: Int): [Int]
       getMessage(id: ID!): Message
   }

   type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id:ID!, input: MessageInput): Message
   }
`); 

 // If Message had any complex fields, we'd put them on this object.
 class Message{
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
 }

// Maps username to content
var fakeDatabase = {};

// The root provides a resolver function for each API endpoint
var root = {
   hello: () => {
   	return 'Hello GraphQL';
   },
   rollDice: (args) => {
       return [args.numDice, args.numSides];
   },
   getMessage:function({id}){
    if(!fakeDatabase[id]){
      throw new Error('no message exists with id'+id)
    }
    return new Message(id, fakeDatabase[id]);
   },
   createMessage:function({input}){
    // random id
    var id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = input;
    return new Message(id, input);
   },
   updateMessage:function({id, input}){
    if(!fakeDatabase[id]){
      throw new Error('no message exists with id'+id)
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
   }
};

// Run the GraphQL query '{ hello }' and print out the response
// graphql(schema, '{ hello }', root).then((response) => {
// 	console.log(response);
// });

var app = express();
app.use(express.static('./'));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000);
console.log('Runing a GraphQL API server at localhost:4000/graphql');