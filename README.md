![Rayova A Fintech Corporation][logo]

# CDK Cognito Secret

This project provides an AWS CDK construct that exports an AWS Cognito client secret to a Secrets Manager secret.

## Usage
<!-- <macro exec="lit-snip ./test/integ.lit.ts"> -->
```ts
// Create your user pool client
const userPoolClient = new cognito.UserPoolClient(scope, 'UserPoolClient2', {
  userPool,
  // Ensure that you generate a user pool client secret
  generateSecret: true,
});

// Create the Secrets Manager secret in which to store the client secret.
const secret = new secretsmanager.Secret(scope, 'Secret');

// Create the UserPoolClientSecret to fill the secret with the client credentials.
new UserPoolClientSecret(scope, 'UserPoolClientSecret', {
  // Fetches the client secret from the given user pool client
  userPool,
  userPoolClient,
  // Stores the client secret here
  secret,
});
```
<!-- </macro> -->

This will produce a JSON secret value like this one:

```json
{
  "issuer": "https://cognito-idp.REGION.amazonaws.com/USER_POOL_ID",
  "clientId": "1234567890abcdefghijklmnop",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

> You can use the issuer's `.well-known/openid-discovery` sub-path to get auth and token endpoints as well as the JWKS.   

[logo]: images/rayova-fintech-corp.png
