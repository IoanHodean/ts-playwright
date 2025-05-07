pipeline {
    agent any

    tools {
        nodejs 'NodeJS18'  // Match the exact name from Jenkins configuration
    }

    parameters {
        booleanParam(
            name: 'RUN_SMOKE',
            defaultValue: true,
            description: 'Run smoke tests'
        )
        booleanParam(
            name: 'RUN_REGRESSION',
            defaultValue: false,
            description: 'Run regression tests'
        )
        booleanParam(
            name: 'RUN_API',
            defaultValue: true,
            description: 'Include API tests'
        )
        booleanParam(
            name: 'RUN_VISUAL',
            defaultValue: true,
            description: 'Include visual regression tests'
        )
        booleanParam(
            name: 'RUN_E2E',
            defaultValue: true,
            description: 'Include E2E tests'
        )
        booleanParam(
            name: 'RUN_CHROME',
            defaultValue: true,
            description: 'Run tests in Chrome'
        )
        booleanParam(
            name: 'RUN_FIREFOX',
            defaultValue: false,
            description: 'Run tests in Firefox'
        )
        booleanParam(
            name: 'RUN_WEBKIT',
            defaultValue: false,
            description: 'Run tests in WebKit'
        )
    }

    environment {
        TEST_USER = credentials('test-user')
        TEST_PASSWORD = credentials('test-password')
        BASE_URL = credentials('base-url')
        API_KEY = credentials('api-key')
    }
 
    stages {
        stage('Setup') {
            steps {
                script {
                    // Test tags helper
                    def getTestTags = {
                        def tags = []
                        if (params.RUN_SMOKE) tags.add('@smoke')
                        if (params.RUN_REGRESSION) tags.add('@regression')
                        return tags.join('|')
                    }

                    // Browser selection helper
                    def getSelectedBrowsers = {
                        def browsers = []
                        if (params.RUN_CHROME) browsers.add('chromium')
                        if (params.RUN_FIREFOX) browsers.add('firefox')
                        if (params.RUN_WEBKIT) browsers.add('webkit')
                        return browsers
                    }

                    // Store for use in other stages
                    env.GREP_PATTERN = getTestTags()
                    env.BROWSERS = getSelectedBrowsers().join(',')
                }
                
                // Clean workspace
                bat 'if exist node_modules (rmdir /s /q node_modules)'
                
                // Install dependencies
                bat 'npm ci'
                bat 'npx playwright install'
                bat 'npx playwright install-deps'
            }
        }      

        stage('Run Tests') { 
            parallel {
                stage('API Tests') {
                    when { expression { params.RUN_API == true } }
                    steps {
                        script {
                            env.BROWSERS.split(',').each { browser ->
                                bat "npx playwright test tests/api --config=api.config.ts --grep \"${env.GREP_PATTERN}\" --project=${browser}"
                            }
                        }
                    }
                }
                stage('Visual Tests') {
                    when { expression { params.RUN_VISUAL == true } }
                    steps {
                        script {
                            env.BROWSERS.split(',').each { browser ->
                                bat "npx playwright test tests/visual --config=visual.config.ts --grep \"${env.GREP_PATTERN}\" --project=${browser}"
                            }
                        }
                    }
                }
                stage('E2E Tests') {
                    when { expression { params.RUN_E2E == true } }
                    steps {
                        script {
                            env.BROWSERS.split(',').each { browser ->
                                bat "npx playwright test tests/e2e --config=playwright.config.ts --grep \"${env.GREP_PATTERN}\" --project=${browser}"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            
            archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
        }
        failure {
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
        }
    }
}