
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Source code checkout successful"'
                sh 'git log -1 --oneline'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config -q'
                sh 'echo "Docker Compose configuration is valid"'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker compose build backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker compose build frontend'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Three-tier application images built successfully.'
        }

        failure {
            echo 'FAILED: Check the Jenkins Console Output for details.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
