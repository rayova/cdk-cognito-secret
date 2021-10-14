const pj = require('projen');

const project = new pj.AwsCdkConstructLibrary({
  author: 'Josh Kellendonk',
  authorAddress: 'joshkellendonk@gmail.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: '@rayova/cdk-cognito-secret',
  repositoryUrl: 'https://github.com/rayova/cdk-cognito-secret.git',
  description: 'Export Cognito client secrets to Secrets Manager',

  keywords: [
    'cdk',
    'cognito',
    'secretsmanager',
    'cloudformation',
    'projen',
  ],

  releaseEveryCommit: true,
  releaseToNpm: true,
  npmAccess: pj.NpmAccess.PUBLIC,

  projenUpgradeSecret: 'BOT_GITHUB_TOKEN',
  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['github-actions', 'github-actions[bot]', 'rayova-bot'],
  },

  cdkDependenciesAsDeps: false,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-cognito',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-secretsmanager',
    '@aws-cdk/custom-resources',
  ],

  devDeps: [
    'aws-cdk',
    'ts-node',
    'aws-sdk',
    'esbuild',
    'markmac@^0.1',
    'shx',
    '@wheatstalk/lit-snip@^0.0',
  ],

  gitignore: [
    '/lambda',
  ],

  // cdkDependencies: undefined,        /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,    /* AWS CDK modules required for testing. */
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
});

const ignores = [
  '/.idea',
  '/cdk.out',
  'tmp-*',
];
for (const ignore of ignores) {
  project.addGitIgnore(ignore);
  project.addPackageIgnore(ignore);
}

const buildFunctionsCommand = 'esbuild --bundle --target=node14 --platform=node --external:aws-sdk src/lambda/user-pool-client-secret.ts --outfile=lambda/user-pool-client-secret/index.js';
project.testTask.exec(buildFunctionsCommand);

const macros = project.addTask('readme-macros');
macros.exec('shx mv README.md README.md.bak');
macros.exec('shx cat README.md.bak | markmac > README.md');
macros.exec('shx rm README.md.bak');
project.buildTask.spawn(macros);

project.package.setScript('integ:lit', 'cdk --app "ts-node -P tsconfig.dev.json test/integ.lit.ts"');
project.package.setScript('build:functions', buildFunctionsCommand);

project.synth();