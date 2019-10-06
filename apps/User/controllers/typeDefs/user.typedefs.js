/**
 * Author
 * Joseph Hentges
 * September 2019
 * https://joeyhentges.com
 *
 * This contains the typedefs string - buildschema for graphql queries / mutations
 *
 * It declares the possible data that can be returned from the grapgql queries.
 * It must match the mongoose model for the most part with small changed.
 * Objects are declared as new types.
 * Queries and mutations / functions must also be decalured.
 *
 * Queries are those that don't change the database
 * Mutations are those that do.
 */

// library
const { buildSchema } = require('graphql');

const defs = `
    scalar Date
    scalar JSON

    scalar QUESTIONANSWER {
        question: String
        answer: String
    }

    scalar SECURITYQUESTIONS {
        questionOne: QUESTIONANSWER
        questionTwo: QUESTIONANSWER
        questionThree: QUESTIONANSWER
    }

    scalar LOGS {
        id: ID
        time: Date
        message: String
    }

    type User {
        id: ID
        locked: Boolean
        disabled: Boolean
        accountVerified: Boolean
        email: String
        password: String
        username: String
        firstName: String
        lastName: String
        dateCreated: Date
        dateModified: Date
        dateLastLoggedIn: Date
        securityQuestions: SECURITYQUESTIONS
        logs: [LOGS]
    }

    type Query {
        getUsers: [User!]!
        getUserById(id: ID!): User
        getUserByUsername(username: String!): User
        getUserByEmail(email: String!): User
    }

    type Mutation {
        updateUser(id: ID!, updateVariable: String!, updateValue: String!): User
    }
`;

module.exports.userTypedefs = buildSchema(`${defs}`);
