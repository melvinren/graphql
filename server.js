var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL shcema language
var schema = buildSchema(`
   type Query {
       hello:String
       rollDice(numDice: Int!, numSides: Int): [Int]
   }
`); 

// The root provides a resolver function for each API endpoint
var root = {
   hello: () => {
   	return 'Hello GraphQL';
   },
   rollDice: (args) => {
       return [args.numDice, args.numSides];
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