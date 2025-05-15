pipeline {
    agent any

    tools {
        nodejs 'NodeJS18'  // Match the exact name from Jenkins configuration
        allure 'Allure'  // Add this line to use configured Allure tool
    }

    parameters {
        // Test type parameters
        booleanParam(name: 'RUN_SMOKE', defaultValue: true, description: 'Run smoke tests')
        booleanParam(name: 'RUN_REGRESSION', defaultValue: false, description: 'Run regression tests')
        booleanParam(name: 'RUN_API', defaultValue: true, description: 'Include API tests')
        booleanParam(name: 'RUN_VISUAL', defaultValue: true, description: 'Include visual regression tests')
        booleanParam(name: 'RUN_E2E', defaultValue: true, description: 'Include E2E tests')
        
        // Browser parameters (single instance)
        booleanParam(name: 'RUN_CHROME', defaultValue: true, description: 'Run tests in Chrome')
        booleanParam(name: 'RUN_FIREFOX', defaultValue: false, description: 'Run tests in Firefox')
        booleanParam(name: 'RUN_WEBKIT', defaultValue: false, description: 'Run tests in WebKit')
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
                        if (params.RUN_CHROME) browsers.add('Chrome')
                        if (params.RUN_FIREFOX) browsers.add('Firefox')
                        if (params.RUN_WEBKIT) browsers.add('Webkit')
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
                
                // Install Allure CLI
                bat 'npm install -g allure-commandline'
                
                // Clean previous results
                bat 'if exist allure-results (rmdir /s /q allure-results)'
                bat 'if exist allure-report (rmdir /s /q allure-report)'
            }
        }      

        stage('Validate Environment') {
            steps {
                script {
                    if (!env.BROWSERS) {
                        error 'No browsers selected for testing'
                    }
                    if (!env.GREP_PATTERN) {
                        echo 'No test patterns selected, will run all tests'
                    }
                    // Log selected configuration
                    echo "Selected Browsers: ${env.BROWSERS}"
                    echo "Test Pattern: ${env.GREP_PATTERN}"
                }
            }
        }

        stage('Run Tests') { 
            parallel {
                stage('API Tests') {
                    when { expression { params.RUN_API == true } }
                    steps {
                        script {
                            env.BROWSERS.split(',').each { browser ->
                                bat "npx playwright test tests/api --config=api.config.ts --grep \"${env.GREP_PATTERN}\""
                            }
                        }
                    }
                }
                // Single script block per test type
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
            script {
                try {
                    // Clean old reports
                    bat 'if exist allure-report (rmdir /s /q allure-report)'
                    
                    // Generate Allure Report
                    bat """
                        allure generate allure-results --clean -o allure-report
                        if exist allure-report\\history (
                            xcopy /E /I /Y allure-report\\history allure-results\\history
                        )
                    """
                    
                    // Publish report
                    allure([
                        includeProperties: false,
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results']]
                    ])
                } catch (Exception e) {
                    echo "Failed to generate Allure report: ${e.message}"
                } finally {
                    archiveArtifacts(
                        artifacts: 'allure-results/**, allure-report/**', 
                        allowEmptyArchive: true,
                        fingerprint: true
                    )
                }
            }
        }
        
        failure {
            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
        }
    }
}