# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### UserPoolClientSecret <a name="@rayova/cdk-cognito-secret.UserPoolClientSecret"></a>

Exports a user pool's client secret to a secrets manager secret.

#### Initializers <a name="@rayova/cdk-cognito-secret.UserPoolClientSecret.Initializer"></a>

```typescript
import { UserPoolClientSecret } from '@rayova/cdk-cognito-secret'

new UserPoolClientSecret(scope: Construct, id: string, props: UserPoolClientSecretProps)
```

##### `scope`<sup>Required</sup> <a name="@rayova/cdk-cognito-secret.UserPoolClientSecret.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@rayova/cdk-cognito-secret.UserPoolClientSecret.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@rayova/cdk-cognito-secret.UserPoolClientSecret.parameter.props"></a>

- *Type:* [`@rayova/cdk-cognito-secret.UserPoolClientSecretProps`](#@rayova/cdk-cognito-secret.UserPoolClientSecretProps)

---





## Structs <a name="Structs"></a>

### UserPoolClientSecretProps <a name="@rayova/cdk-cognito-secret.UserPoolClientSecretProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { UserPoolClientSecretProps } from '@rayova/cdk-cognito-secret'

const userPoolClientSecretProps: UserPoolClientSecretProps = { ... }
```

##### `secret`<sup>Required</sup> <a name="@rayova/cdk-cognito-secret.UserPoolClientSecretProps.property.secret"></a>

```typescript
public readonly secret: Secret;
```

- *Type:* [`aws-cdk-lib.aws_secretsmanager.Secret`](#aws-cdk-lib.aws_secretsmanager.Secret)

Stores client credentials in this secret.

---

##### `userPool`<sup>Required</sup> <a name="@rayova/cdk-cognito-secret.UserPoolClientSecretProps.property.userPool"></a>

```typescript
public readonly userPool: UserPool;
```

- *Type:* [`aws-cdk-lib.aws_cognito.UserPool`](#aws-cdk-lib.aws_cognito.UserPool)

Provide the user pool of the user pool client.

---

##### `userPoolClient`<sup>Required</sup> <a name="@rayova/cdk-cognito-secret.UserPoolClientSecretProps.property.userPoolClient"></a>

```typescript
public readonly userPoolClient: UserPoolClient;
```

- *Type:* [`aws-cdk-lib.aws_cognito.UserPoolClient`](#aws-cdk-lib.aws_cognito.UserPoolClient)

Provide the user pool client from which to get the secret.

---



