import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { UserPoolClientSecretFunction } from './user-pool-client-secret-function';

export interface UserPoolClientSecretProps {
  /** Provide the user pool of the user pool client */
  readonly userPool: cognito.UserPool;
  /** Provide the user pool client from which to get the secret */
  readonly userPoolClient: cognito.UserPoolClient;
  /** Stores client credentials in this secret */
  readonly secret: secretsmanager.Secret;
}

/** Exports a user pool's client secret to a secrets manager secret */
export class UserPoolClientSecret extends Construct {
  constructor(scope: Construct, id: string, props: UserPoolClientSecretProps) {
    super(scope, id);

    const onEventHandler = new UserPoolClientSecretFunction(this, 'OnEventHandler', {
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