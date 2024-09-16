pipeline {
    agent { label 'docker' }

    environment {
        GCP_PROJECT_ID = 'concierge-miami'
        IMAGE_NAME     = 'itinerary'
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        DOCKER_IMAGE   = "gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"
        K8S_NAMESPACE  = 'dev'
        ARGOCD_SERVER  = '35.188.83.107'
        REPO_NAME      = 'itinerary'
        REPO_URL = 'https://github.com/olagunjuraman/Itineray'
        GIT_CREDENTIALS = credentials('github-credentials')
    }

    stages {
        //  stage('Set Environment') {
        //     steps {
        //         script {
        //             switch(env.GIT_BRANCH) {
        //                 case 'dev':
        //                     env.DEPLOY_ENV = 'dev'
        //                     env.K8S_NAMESPACE = 'dev'
        //                     break
        //                 case 'stage':
        //                     env.DEPLOY_ENV = 'stage'
        //                     env.K8S_NAMESPACE = 'stage'
        //                     break
        //                 case 'main':
        //                     env.DEPLOY_ENV = 'prod'
        //                     env.K8S_NAMESPACE = 'prod'
        //                     break
        //                 default:
        //                     error("Branch ${env.GIT_BRANCH} does not have a defined deployment environment")
        //             }
        //             echo "Deploying to ${env.DEPLOY_ENV} environment"
        //         }
        //     }
        // }

        stage('Set Environment') {
            steps {
                script {
                    def branchName = env.GIT_BRANCH.replaceFirst(/^origin\//, '')
                    echo "Branch name: ${branchName}"
                    
                    switch(branchName) {
                        case 'dev':
                            env.DEPLOY_ENV = 'dev'
                            env.K8S_NAMESPACE = 'dev'
                            break
                        case 'stage':
                            env.DEPLOY_ENV = 'stage'
                            env.K8S_NAMESPACE = 'stage'
                            break
                        case 'main':
                        case 'master':  // Include both main and master for flexibility
                            env.DEPLOY_ENV = 'prod'
                            env.K8S_NAMESPACE = 'prod'
                            break
                        default:
                            error("Branch ${branchName} does not have a defined deployment environment")
                    }
                    echo "Deploying to ${env.DEPLOY_ENV} environment"
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Kubernetes Manifests') {
    steps {
        withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE')]) {
            sh """
                gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
                gcloud container clusters get-credentials  cluster-1 --zone us-central1-c --project ${GCP_PROJECT_ID}
                kubectl --dry-run=client -f k8s/ apply
            """
        }
    }
    }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE')])
                     {
                        sh '''
                            gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
                            gcloud config set project ${GCP_PROJECT_ID}
                            gcloud auth configure-docker gcr.io -q
                            docker build -t ${DOCKER_IMAGE} .
                            docker push ${DOCKER_IMAGE}
                        '''
                    }
                }
            }
        }


        stage('Update Kubernetes Manifests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh """
                        git config user.email 'jenkins@example.com'
                        git config user.name 'Jenkins'
                        sed -i 's|image: .*|image: ${DOCKER_IMAGE}|' k8s/deployment.yml
                        git add k8s/deployment.yml
                        git commit -m 'Update image to ${DOCKER_IMAGE}' || true
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/olagunjuraman/Itineray.git HEAD:refs/heads/main
                    """
                }
            }
        }



    stage('Create ArgoCD Repository and Application') {
    steps {
        script {
            def repoUrl = sh(script: 'git config --get remote.origin.url', returnStdout: true).trim()
              def appName = "${IMAGE_NAME}-${env.DEPLOY_ENV}"
            
            withCredentials([
                file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE'),
                usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME'),
                usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')
            ]) {

                sh '''
                gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
                gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project ${GCP_PROJECT_ID}
                '''

                sh '''
                argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USERNAME} --password ${ARGOCD_PASSWORD} --insecure
                '''

                sh '''
                echo "App Name: ${appName}"
                argocd repo add https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/olagunjuraman/itineray.git --name itinerary --type git || true
                '''

                sh """
                argocd app create ${appName} \
                    --repo ${repoUrl} \
                    --path ./k8s/${env.DEPLOY_ENV} \
                    --dest-server https://kubernetes.default.svc \
                    --dest-namespace ${env.K8S_NAMESPACE} \
                    --project default \
                    --sync-policy automated
                """
            }
            
            echo "ArgoCD Application URL: ${ARGOCD_SERVER}/applications/${appName}"
        }
    }
}

    }

   
}