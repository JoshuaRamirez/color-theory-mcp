export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the conventional commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only changes
        'style', // Changes that do not affect the meaning of the code
        'refactor', // A code change that neither fixes a bug nor adds a feature
        'perf', // A code change that improves performance
        'test', // Adding missing tests or correcting existing tests
        'build', // Changes that affect the build system or external dependencies
        'ci', // Changes to CI configuration files and scripts
        'chore', // Other changes that don't modify src or test files
        'revert', // Reverts a previous commit
      ],
    ],
    // Subject should not be empty
    'subject-empty': [2, 'never'],
    // Subject should not end with period
    'subject-full-stop': [2, 'never', '.'],
    // Subject should be in sentence case (first letter capitalized or lowercase)
    'subject-case': [0],
    // Type should not be empty
    'type-empty': [2, 'never'],
    // Type should be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Header should not exceed 100 characters
    'header-max-length': [2, 'always', 100],
    // Body lines should not exceed 100 characters
    'body-max-line-length': [1, 'always', 100],
    // Footer lines should not exceed 100 characters
    'footer-max-line-length': [1, 'always', 100],
  },
};
