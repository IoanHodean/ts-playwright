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
            description: 'Run API tests'
        )
        booleanParam(
            name: 'RUN_VISUAL',
            defaultValue: true,
            description: 'Run visual regression tests'
        )
        booleanParam(
            name: 'RUN_E2E',
            defaultValue: true,
            description: 'Run E2E tests'
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
                    // Define the function as a closure
                    def getTestTags = {
                        def tags = []
                        if (params.RUN_SMOKE) tags.add('@smoke')
                        if (params.RUN_REGRESSION) tags.add('@regression')
                        return tags.join('|')
                    }
                    // Store it for use in other stages
                    env.GREP_PATTERN = getTestTags()
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
                        bat "npx playwright test tests/api --config=api.config.ts --grep \"${env.GREP_PATTERN}\""
                    }
                }
                stage('Visual Tests') {
                    when { expression { params.RUN_VISUAL == true } }
                    steps {
                        bat "npx playwright test tests/visual --config=visual.config.ts --grep \"${env.GREP_PATTERN}\""
                    }
                }
                stage('E2E Tests') {
                    when { expression { params.RUN_E2E == true } }
                    steps {
                        bat "npx playwright test tests/e2e --config=playwright.config.ts --grep \"${env.GREP_PATTERN}\""
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