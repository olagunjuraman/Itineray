pipeline {
    agent { label 'docker' }

    environment {
        GCP_PROJECT_ID = 'concierge-miami'
        GCR_REGION     = 'us-central1' 
        IMAGE_NAME     = 'itinerary' 
        IMAGE_TAG      = "${env.BUILD_NUMBER}" 
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
                    
                    wrap([$class: 'GCloudBuildWrapper']) {
                        docker.build(fullImageName)
                        
                        withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCR_KEY_FILE')]) {
                            sh '''
                                gcloud auth activate-service-account --key-file=${GCR_KEY_FILE}
                                gcloud auth configure-docker ${GCR_REGION}.gcr.io -q
                                docker push ${fullImageName}
                            '''
                        }
                        
                        echo "Built and pushed Docker image: ${fullImageName}"
                    }
                }
            }
        }
    }
}