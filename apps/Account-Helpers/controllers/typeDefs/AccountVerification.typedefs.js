/**
 * Author
 * Joseph Hentges
 * October 2019
 * https://joeyhentges.com
 *
 * The typedefs file for Account Verification graphQL queries and mutations.
 * This is a schema for what data can be returned from the data, and what functions are 'callable'
 */

const { buildSchema } = require('graphql');

const defs = `
    scalar Date

    type AccountVerification {
        id: ID
        fulfilled: Boolean
        userId: String
        userFirstName: String
        userUsername: String
        expirationDate: Date
    }

    type Query {
        getAccountVerifications: [AccountVerification!]!
        getAccountVerificationById(id: ID!): AccountVerification
    }

    type Mutation {
        createAccountVerification(userId: String!, userFirstName: String, userUsername: String): AccountVerification
        updateFulfilled(id: ID!): AccountVerification
    }
`;

// build the schema from the defs string and export it
module.exports.AccountVerificationTypedefs = buildSchema(`${defs}`);
