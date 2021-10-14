import * as path from 'path';
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';

export interface UserPoolClientSecretProps {
  /** Provide the user pool of the user pool client */
  readonly userPool: cognito.UserPool;
  /** Provide the user pool client from which to get the secret */
  readonly userPoolClient: cognito.UserPoolClient;
  /** Stores client credentials in this secret */
  readonly secret: secretsmanager.Secret;
}

/** Exports a user pool's client secret to a secrets manager secret */
export class UserPoolClientSecret extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: UserPoolClientSecretProps) {
    super(scope, id);

    const onEventHandler = new lambda.Function(this, 'OnEventHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.onEvent',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'user-pool-client-secret')),
      initialPolicy: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['cognito-idp:DescribeUserPoolClient'],
          resources: [props.userPool.userPoolArn],
        }),
      ],
    });
    props.secret.grantWrite(onEventHandler);

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler,
    });

    new cdk.CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: {
        userPoolId: props.userPool.userPoolId,
        userPoolClientId: props.userPoolClient.userPoolClientId,
        secretArn: props.secret.secretArn,
        issuer: props.userPool.userPoolProviderUrl,
      },
    });
  }
}