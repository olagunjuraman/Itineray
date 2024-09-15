pipeline {
    agent { label 'docker' }

    environment {
        GCP_PROJECT_ID = 'concierge-miami'
        GCR_REGION     = 'us' 
        IMAGE_NAME     = 'itinerary' 
        IMAGE_TAG      = "${env.BUILD_NUMBER}" 
        GCP_KEY        = credentials('gcr-service-account-key')
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
                    def fullImageName = "${GCR_REGION}.gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"

                    withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE')]) {
                        sh "gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}"
                        sh "gcloud config set project ${GCP_PROJECT_ID}"
                        sh "gcloud auth configure-docker ${GCR_REGION}.gcr.io -q"

                        sh "docker build -t ${fullImageName} ."
                        sh "docker push ${fullImageName}"

                        echo "Built and pushed Docker image: ${fullImageName}"
                    }
                }
            }
        }
    }

    // post {
    //     always {
    //         sh "gcloud auth revoke --all"
    //     }
    // }
}