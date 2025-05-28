pipeline {
    agent any

    parameters {
        // Test type parameters
        booleanParam(name: 'RUN_SMOKE', defaultValue: true, description: 'Run smoke tests')
        booleanParam(name: 'RUN_REGRESSION', defaultValue: false, description: 'Run regression tests')
        booleanParam(name: 'RUN_API', defaultValue: true, description: 'Include API tests')
        booleanParam(name: 'RUN_VISUAL', defaultValue: true, description: 'Include visual regression tests')
        booleanParam(name: 'RUN_E2E', defaultValue: true, description: 'Include E2E tests')
        
        // Browser parameters
        booleanParam(name: 'RUN_CHROME', defaultValue: true, description: 'Run tests in Chrome')
        booleanParam(name: 'RUN_FIREFOX', defaultValue: false, description: 'Run tests in Firefox')
        booleanParam(name: 'RUN_WEBKIT', defaultValue: false, description: 'Run tests in WebKit')
    }

    environment {
        TEST_USER = credentials('test-user')
        TEST_PASSWORD = credentials('test-password')
        BASE_URL = credentials('base-url')
        API_KEY = credentials('api-key')
        // Use the host path directly for Docker volume mounting
        HOST_PROJECT_PATH = '/d/ts-playwright'
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
                
                // Use Docker for setup with host path
                script {
                    sh """
                        docker run --rm \\
                        -v ${env.HOST_PROJECT_PATH}:/app \\
                        -w /app \\
                        playwright-tests \\
                        npm ci
                    """
                }
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
                            sh """
                                docker run --rm \\
                                -v ${env.HOST_PROJECT_PATH}:/app \\
                                -w /app \\
                                -e TEST_USER=${env.TEST_USER} \\
                                -e TEST_PASSWORD=${env.TEST_PASSWORD} \\
                                -e BASE_URL=${env.BASE_URL} \\
                                -e API_KEY=${env.API_KEY} \\
                                playwright-tests \\
                                npx playwright test tests/api --config=api.config.ts --grep "${env.GREP_PATTERN}"
                            """
                        }
                    }
                }
                stage('Visual Tests') {
                    when { expression { params.RUN_VISUAL == true } }
                    steps {
                        script {
                            env.BROWSERS.split(',').each { browser ->
                                sh """
                                    docker run --rm \\
                                    -v ${env.HOST_PROJECT_PATH}:/app \\
                                    -w /app \\
                                    -e TEST_USER=${env.TEST_USER} \\
                                    -e TEST_PASSWORD=${env.TEST_PASSWORD} \\
                                    -e BASE_URL=${env.BASE_URL} \\
                                    -e API_KEY=${env.API_KEY} \\
                                    playwright-tests \\
                                    npx playwright test tests/visual --config=visual.config.ts --grep "${env.GREP_PATTERN}" --project=${browser}
                                """
                            }
                        }
                    }
                }
                stage('E2E Tests') {
                    when { expression { params.RUN_E2E == true } }
                    steps {
                        script {
                            env.BROWSERS.split(',').each { browser ->
                                sh """
                                    docker run --rm \\
                                    -v ${env.HOST_PROJECT_PATH}:/app \\
                                    -w /app \\
                                    -e TEST_USER=${env.TEST_USER} \\
                                    -e TEST_PASSWORD=${env.TEST_PASSWORD} \\
                                    -e BASE_URL=${env.BASE_URL} \\
                                    -e API_KEY=${env.API_KEY} \\
                                    playwright-tests \\
                                    npx playwright test tests/e2e --config=playwright.config.ts --grep "${env.GREP_PATTERN}" --project=${browser}
                                """
                            }
                        }
                    }
                }
            }
            post {
                always {
                    // Copy reports from host to workspace for Jenkins to access
                    script {
                        try {
                            sh """
                                docker run --rm \\
                                -v ${env.HOST_PROJECT_PATH}:/app \\
                                -v ${env.WORKSPACE}:/workspace \\
                                -w /app \\
                                playwright-tests \\
                                sh -c "cp -r playwright-report /workspace/ 2>/dev/null || true; cp -r test-results /workspace/ 2>/dev/null || true"
                            """
                            
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Report',
                                reportTitles: '',
                                escapeUnderscores: false,
                                includes: '**/*'
                            ])
                            
                            archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
                        } catch (Exception e) {
                            echo "Publishing failed: ${e.getMessage()}"
                        }
                    }
                }
                failure {
                    script {
                        try {
                            archiveArtifacts artifacts: 'test-results/**/*', fingerprint: true
                        } catch (Exception e) {
                            echo "Test results archiving failed: ${e.getMessage()}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed!'
        }
        success {
            echo '✅ All tests passed!'
        }
        failure {
            echo '❌ Some tests failed!'
        }
    }
}