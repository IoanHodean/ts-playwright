pipeline {
    agent any

    tools {
        nodejs 'NodeJS18'  // Match the exact name from Jenkins configuration
    }

    parameters {
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
    }
 
    stages {
        stage('Setup') {
            steps {
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
                        bat 'npx playwright test tests/api --config=api.config.ts'
                    }
                }
                stage('Visual Tests') {
                    when { expression { params.RUN_VISUAL == true } }
                    steps {
                        bat 'npx playwright test tests/visual --config=visual.config.ts'
                    }
                }
                stage('E2E Tests') {
                    when { expression { params.RUN_E2E == true } }
                    steps {
                        bat 'npx playwright test tests/e2e --config=playwright.config.ts'
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