/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * The typedefs file for Password Reset graphQL queries and mutations.
 * This is a schema for what data can be returned from the data, and what functions are 'callable'
 */

const { buildSchema } = require('graphql');

const defs = `
    scalar Date

    type PasswordReset {
        id: ID
        fulfilled: Boolean
        userId: String
        userFirstName: String
        userUsername: String
        expirationDate: Date
    }

    type Query {
        getPasswordResets: [PasswordReset!]!
        getPasswordResetById(id: ID!): PasswordReset
    }

    type Mutation {
        createPasswordReset(userId: String!, userFirstName: String, userUsername: String): PasswordReset!
        updateFulfilled(id: ID!): PasswordReset!
    }
`;

// build the schema from the defs string and export it
module.exports.PasswordResetTypedefs = buildSchema(`${defs}`);
