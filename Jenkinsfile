pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "scam-bank-gateway"
        PROJECT_VERSION = "${BUILD_NUMBER}"
        USERNAME = "microseversk"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ScamBank/scam-bank-gateway.git'
            }
        }

        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Push to Registry') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh 'docker-compose push'
                }
            }
        }
    }
    post {
        success {
            script {
                sh '''
                echo "Stopping and removing old containers..."
                docker-compose down

                echo "Cleaning up old images..."
                docker image prune -f

                echo "Starting new containers..."
                docker-compose up -d
                '''
            }
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}