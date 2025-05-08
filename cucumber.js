export default {
    default: {
        paths: ['features/**/*.feature'],
        requireModule: ['ts-node/register/esm'],
        require: ['setup/**/*.ts', 'features/step-definitions/**/*.ts'],
        format: [
            'progress',
            'json:reports/cucumber-report.json',
            'html:reports/cucumber-report.html'
        ],
        parallel: 2
    }
};
