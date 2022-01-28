import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { UserPoolClientSecret } from '../src';

export class IntegLit extends cdk.Stack {
  constructor(scope_: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    // Snipped docs want to show 'scope' instead of 'this'
    const scope = this;
    const userPool = new cognito.UserPool(scope, 'UserPool');

    // ::SNIP
    // Create your user pool client
    const userPoolClient = new cognito.UserPoolClient(scope, 'UserPoolClient', {
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
    // ::END-SNIP
  }
}

const app = new cdk.App();
new IntegLit(app, 'integ-cdk-congito-secret');
app.synth();