pipeline {
    agent any

    tools {
        nodejs 'NodeJS18'  // Match the exact name from Jenkins configuration
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

        stage('Generate Auth Token') {
            when {
                expression { false }  // This makes the stage always skip
            }
            steps {
                bat 'npx playwright test tests/setup/auth.setup.ts'
            }
        }

        stage('Run Tests') {
            parallel {
                stage('API Tests') {
                    steps {
                        bat 'npx playwright test tests/api --config=api.config.ts'
                    }
                }
                stage('Visual Tests') {
                    steps {
                        bat 'npx playwright test tests/visual --config=visual.config.ts'
                    }
                }
                stage('E2E Tests') {
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