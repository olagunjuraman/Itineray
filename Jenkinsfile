pipeline {
    agent { label 'docker' }

    environment {
        GCP_PROJECT_ID = 'concierge-miami'
        GCR_REGION     = 'us-central1' 
        IMAGE_NAME     = 'itinerary' 
        IMAGE_TAG      = "${env.BUILD_NUMBER}" 
    }

    stages {
        stage('Diagnostics') {
            steps {
                sh 'df -h'
                sh 'df -i'
                sh 'docker system df -v'
                sh 'docker info'
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Docker Image') {
            agent {
                docker {
                    image 'google/cloud-sdk:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                    reuseNode true
                }
            }
            steps {
                script {
                    def fullImageName = "${GCR_REGION}.gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"
                    
                    withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCR_KEY_FILE')]) {
                        sh """
                            gcloud auth activate-service-account --key-file=\$GCR_KEY_FILE
                            gcloud auth configure-docker ${GCR_REGION}.gcr.io -q
                            docker build -t ${fullImageName} .
                            docker push ${fullImageName}
                        """
                    }
                    
                    echo "Built and pushed Docker image: ${fullImageName}"
                }
            }
        }
    }
}