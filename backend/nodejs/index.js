var express = require('express');
var {graphqlHTTP} = require('express-graphql');
var {buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    findPersons(maxResults: Int = 50, startFrom: Int = 0): [Person!]
    
    personById(id: String): Person
  }
  
  type Person {
    id: String!
    firstname: String!
    lastname: String!
    birthdate: String
    addresses: [Address]
  }
  
  type Address {
    id: String!
    type: String!
    street: String!
    zipcode: String!
    country: String!
  }
`);


let persons = [
    {
        'id': 'aaa',
        'firstname': 'John',
        'lastname': 'Smith',
    },
    {
        'id': 'aab',
        'firstname': 'Will',
        'lastname': 'Smith',
    },
    {
        'id': 'aac',
        'firstname': 'Jane',
        'lastname': 'Smith',
    }
];

// The root provides a resolver function for each API endpoint
var root = {
    findPersons : (args) => {
        return persons.slice(args.startFrom, args.startFrom + args.maxResults);
    },
    personById: (args) => {
        for (const person of persons) {
            if(person.id === args.id) {
                return person;
            }
        }

        return null;
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
