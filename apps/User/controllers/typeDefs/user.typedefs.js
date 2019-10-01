const { buildSchema } = require('graphql');

const defs = `
    scalar Date
    scalar JSON

    type QUESTIONANSWER {
        question: String
        answer: String
    }

    type SECURITYQUESTIONS {
        questionOne: QUESTIONANSWER
        questionTwo: QUESTIONANSWER
        questionThree: QUESTIONANSWER
    }

    type LOGS {
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

    scalar Permission {
        title: String
        type: String
        description: String
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
