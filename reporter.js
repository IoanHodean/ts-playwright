import { generate } from 'cucumber-html-reporter';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber_report.json',
    output: 'reports/cucumber_report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        'App Version': '0.3.2',
        'Test Environment': `${process.env.ENV}`,
        'Browser': 'Chrome  110.0.0',
        'Platform': 'Windows 10',
        'Parallel': 'Scenarios',
        'Executed': 'Remote'
    },
};

generate(options);