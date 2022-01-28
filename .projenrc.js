const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  name: '@rayova/cdk-cognito-secret',
  author: 'Josh Kellendonk',
  authorAddress: 'joshkellendonk@gmail.com',
  repositoryUrl: 'https://github.com/rayova/cdk-cognito-secret.git',
  description: 'Export Cognito client secrets to Secrets Manager',

  keywords: [
    'cdk',
    'cognito',
    'secretsmanager',
    'cloudformation',
    'projen',
  ],

  defaultReleaseBranch: 'main',

  releaseEveryCommit: true,
  releaseToNpm: true,

  depsUpgradeOptions: {
    ignoreProjen: false,
  },

  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['github-actions', 'github-actions[bot]', 'rayova-bot'],
  },

  cdkVersion: '2.0.0',

  devDeps: [
    'ts-node',
    'aws-sdk',
    'esbuild',
    'markmac@^0.1',
    'shx',
    '@wheatstalk/lit-snip@^0.0',
  ],
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
project.postCompileTask.spawn(macros);

project.synth();