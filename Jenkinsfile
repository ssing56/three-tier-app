
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

        stage('Prepare Trivy Reports') {
            steps {
                sh 'mkdir -p trivy-reports'
            }
        }

        stage('Backend API Health Test') {
            steps {
                sh '''
                    set -eu

                    docker compose up -d mongodb backend

                    success=0
                    for i in $(seq 1 30); do
                        if curl -fsS http://localhost:5000/api/health; then
                            success=1
                            break
                        fi
                        sleep 2
                    done

                    if [ "$success" -ne 1 ]; then
                        echo "Backend health test failed"
                        exit 1
                    fi

                    echo "Backend health test passed"
                '''
            }
        }

        stage('Trivy Backend Scan') {
            steps {
                sh '''
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      -v "$WORKSPACE/trivy-reports:/reports" \
                      aquasec/trivy:latest image \
                      --scanners vuln \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      --format json \
                      --output /reports/backend-trivy.json \
                      three-tier-app-backend:latest

                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --scanners vuln \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      --format table \
                      three-tier-app-backend:latest \
                      > trivy-reports/backend-trivy.txt
                '''
            }
        }

        stage('Trivy Frontend Scan') {
            steps {
                sh '''
                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      -v "$WORKSPACE/trivy-reports:/reports" \
                      aquasec/trivy:latest image \
                      --scanners vuln \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      --format json \
                      --output /reports/frontend-trivy.json \
                      three-tier-app-frontend:latest

                    docker run --rm \
                      -v /var/run/docker.sock:/var/run/docker.sock \
                      aquasec/trivy:latest image \
                      --scanners vuln \
                      --severity HIGH,CRITICAL \
                      --ignore-unfixed \
                      --exit-code 0 \
                      --format table \
                      three-tier-app-frontend:latest \
                      > trivy-reports/frontend-trivy.txt
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-reports/*',
                             allowEmptyArchive: true,
                             fingerprint: true

            echo 'Pipeline finished. Check archived Trivy reports for findings.'
        }

        success {
            echo 'SUCCESS: Build, API health test and Trivy scans completed.'
        }

        failure {
            echo 'FAILED: Check Console Output for the failing stage.'
        }
    }
}

