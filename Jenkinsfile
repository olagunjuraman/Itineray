pipeline {
    agent { label 'docker' }

    environment {
        GCP_PROJECT_ID = 'concierge-miami'
        IMAGE_NAME     = 'itinerary'
        IMAGE_TAG      = "${env.BUILD_NUMBER}" 
        GCP_KEY        = credentials('gcr-json-key')
        DOCKER_IMAGE   = "gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def fullImageName = "gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"

                    withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE')]) {
                        sh "gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}"
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        sh "gcloud auth configure-docker gcr.io -q"

                        sh "docker build -t ${fullImageName} ."
                        sh "docker push ${fullImageName}"

                        echo "Built and pushed Docker image: ${fullImageName}"
                    }
                }
            }
        }
        stage('Clean Local Docker Image') {
            steps {
                sh "docker rmi ${DOCKER_IMAGE}"
            }
        }
    }

    post {
        always {
            cleanWs()
            sh "gcloud auth revoke --all"
        }
        success {
            echo "Successfully built and pushed image: ${DOCKER_IMAGE}"
        }
        failure {
            echo "Failed to build/push image: ${DOCKER_IMAGE}"
        }
    }

}