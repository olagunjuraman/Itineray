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

        // stage('YAML Validation') {
        //     agent {
        //         docker {
        //             image 'python:3.9-slim'
        //             args '--rm -u root'
        //         }
        //     }
        //     steps {
        //         sh 'pip install yamllint'
        //         sh 'find . -name "*.yaml" -o -name "*.yml" | xargs yamllint'
        //     }
        // }

        // stage('Schema Validation') {
        //     agent {
        //         docker {
        //             image 'garethr/kubeval'
        //             args '--rm'
        //         }
        //     }
        //     steps {
        //         sh 'find . -name "*.yaml" -o -name "*.yml" | xargs kubeval --strict'
        //     }
        // }

        // stage('Install Dependencies and Build') {
        //     agent {
        //         docker {
        //             image 'node:14'
        //             args '--rm'
        //         }
        //     }
        //     steps {
        //         sh 'npm ci'
        //         sh 'npm run build'
        //     }
        // }
        stage('Docker Info') {
    steps {
        sh 'id'
        sh 'groups'
        sh 'docker info'
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

    // post {
    //     always {
    //         cleanWs()
    //         sh 'docker system prune -f'  
    //     }
    //     success {
    //         echo 'Pipeline completed successfully!'
    //     }
    //     failure {
    //         echo 'Pipeline failed. Check the logs for details.'
    //     }
    // }
}