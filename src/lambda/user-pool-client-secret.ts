// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';

export async function onEvent(event: any) {
  console.log('event =', event);

  const requestType: string = event.RequestType;
  if (!requestType) {
    throw new Error('Request type not specified');
  }
  if (requestType === 'Delete') {
    return {};
  }

  const resourceProperties: Record<string, string> = event.ResourceProperties ?? {};

  function getResourceProperty(name: string): string {
    const value: string = resourceProperties[name];
    if (value === undefined) {
      throw new Error(`Resource is missing the ${name} property`);
    }

    return value;
  }

  const userPoolId = getResourceProperty('userPoolId');
  const userPoolClientId = getResourceProperty('userPoolClientId');
  const userPoolRegion = resourceProperties.userPoolRegion ?? undefined;
  const secretArn = getResourceProperty('secretArn');
  const issuer = getResourceProperty('issuer');

  const secretArnParts = secretArn.split(':');
  // arn:aws:secretsmanager:REGION:ACCOUNT:secret:SECRET_NAME
  const secretRegion = secretArnParts[3];

  const idsp = new AWS.CognitoIdentityServiceProvider({ region: userPoolRegion });
  const sm = new AWS.SecretsManager({ region: secretRegion });

  const { UserPoolClient } = await idsp.describeUserPoolClient({
    UserPoolId: userPoolId,
    ClientId: userPoolClientId,
  }).promise();

  if (!UserPoolClient) {
    throw new Error('Received an empty UserPoolClient when describing the user pool client');
  }

  await sm.putSecretValue({
    SecretId: secretArn,
    SecretString: JSON.stringify({
      issuer,
      clientId: UserPoolClient.ClientId,
      clientSecret: UserPoolClient.ClientSecret,
    }),
  }).promise();

  return {};
}