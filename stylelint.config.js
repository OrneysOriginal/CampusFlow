export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['dist/**'],
  rules: {
    'no-descending-specificity': null,
    'selector-class-pattern': null,
  },
};
