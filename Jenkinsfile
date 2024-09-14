pipeline {
     agent {
        docker {
            image 'python:3.9-slim'  // This image includes pip
        }
     }

    environment {
        GCP_PROJECT_ID = 'your-gcp-project-id'
        GCR_REGION     = 'us' 
        IMAGE_NAME     = 'your-image-name' 
        IMAGE_TAG      = "${env.BUILD_NUMBER}" 
    }

    stages {
        stage('Checkout') {
            steps {

                checkout scm
            }
        }


         stage('Validate YAML Syntax') {
            steps {
                // Install yamllint if not already available
                sh 'pip install yamllint || echo "yamllint already installed"'
                // Run yamllint on all YAML files
                sh 'find . -name "*.yaml" -o -name "*.yml" | xargs yamllint'
            }
        }

        stage('Schema Validation with Kubeval') {
            steps {
                // Install kubeval if not already available
                sh 'wget -q -O - https://github.com/instrumenta/kubeval/releases/download/v0.16.0/kubeval-linux-amd64.tar.gz | tar -xzv'
                sh 'chmod +x kubeval && mv kubeval /usr/local/bin/'
                // Run kubeval on all YAML files
                sh 'find . -name "*.yaml" -o -name "*.yml" | xargs kubeval --strict'
            }
        }


        stage('Install Dependencies') {
            steps {

                sh 'npm install'
            }
        }

        stage('Build') {
            steps {

                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def fullImageName = "${GCR_REGION}.gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"
                    
                    dockerImage = docker.build(fullImageName)
                    
                    echo "Built Docker image: ${fullImageName}"
                }
            }
        }

        stage('Authenticate with GCR') {
            steps {
    
                withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCR_KEY_FILE')]) {
                    sh """
                        echo "Authenticating with GCR..."
                        gcloud auth activate-service-account --key-file=${GCR_KEY_FILE}
                        gcloud auth configure-docker ${GCR_REGION}.gcr.io
                    """
                }
            }
        }

        stage('Push to GCR') {
            steps {
                script {

                    dockerImage.push()
                    echo "Pushed Docker image to GCR: ${dockerImage.id}"
                }
            }
        }

       
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}
