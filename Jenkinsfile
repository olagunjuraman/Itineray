




// pipeline {
//     agent { label 'docker' }

//     environment {
//         GCP_PROJECT_ID = 'concierge-miami'
//         IMAGE_NAME     = '${IMAGE_NAME}'  
//         IMAGE_TAG      = "${env.BUILD_NUMBER}"
//         GCP_KEY        = credentials('gcr-json-key')
//         DOCKER_IMAGE   = "gcr.io/${GCP_PROJECT_ID}/${IMAGE_NAME}:${IMAGE_TAG}"
//         K8S_NAMESPACE  = '${K8S_NAMESPACE}'  
//         ARGOCD_SERVER  = '34.31.37.25'  
//         ARGOCD_CREDS   = credentials('argocd-api-key')
//         REPO_NAME =     'itinerary'
//         ARGOCD_AUTH_TOKEN = '9GP0RGAN0A4QQFCi'
//         K8S_NAMESPACE = 'dev'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Validate Kubernetes Manifests') {
//             steps {
//                 script {
//                     sh 'kubectl --dry-run=client -f kubernetes/ apply'
//                 }
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     sh "docker build -t ${DOCKER_IMAGE} ."
//                 }
//             }
//         }

//         stage('Push to GCR') {
//             steps {
//                 withCredentials([file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE')]) {
//                     sh "gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}"
//                     sh "gcloud config set project ${GCP_PROJECT_ID}"
//                     sh "gcloud auth configure-docker gcr.io -q"
//                     sh "docker push ${DOCKER_IMAGE}"
//                 }
//             }
//         }

//         stage('Update Kubernetes Manifests') {
//             steps {
//                 script {
//                     sh "sed -i 's|image: .*|image: ${DOCKER_IMAGE}|' kubernetes/deployment.yaml"
//                     sh "git config user.email 'jenkins@example.com'"
//                     sh "git config user.name 'Jenkins'"
//                     sh "git add kubernetes/deployment.yaml"
//                     sh "git commit -m 'Update image to ${DOCKER_IMAGE}'"
//                     sh "git push origin HEAD:main"
//                 }
//             }
//         }


//         stage('Create ArgoCD Repository') {
//     steps {
//         script {
//             def repoResource = """
//             apiVersion: argoproj.io/v1alpha1
//             kind: Repository
//             metadata:
//               name: ${REPO_NAME}
//               namespace: argocd
//             spec:
//               url: ${REPO_URL}
//               type: git
//             """
//             writeFile file: 'repo-resource.yaml', text: repoResource
            
//             withCredentials([string(credentialsId: 'argocd-api-key', variable: 'ARGOCD_AUTH_TOKEN')]) {
//                 sh """
//                 kubectl --token=${ARGOCD_AUTH_TOKEN} \
//                     --server=${ARGOCD_SERVER} \
//                     --insecure-skip-tls-verify \
//                     apply -f repo-resource.yaml
//                 """
//             }
//         }
//     }


//         }


//         stage('Create/Update ArgoCD Application') {
//             steps {
//                 script {
//                     def appName = "${IMAGE_NAME}-${K8S_NAMESPACE}"
//                     def repoUrl = sh(script: 'git config --get remote.origin.url', returnStdout: true).trim()
//                     def appYaml = """
//                     apiVersion: argoproj.io/v1alpha1
//                     kind: Application
//                     metadata:
//                       name: ${appName}
//                       namespace: argocd
//                     spec:
//                       project: default
//                       source:
//                         repoURL: ${repoUrl}
//                         targetRevision: HEAD
//                         path: kubernetes
//                       destination:
//                         server: https://kubernetes.default.svc
//                         namespace: ${K8S_NAMESPACE}
//                       syncPolicy:
//                         automated:
//                           prune: true
//                           selfHeal: true
//                     """
//                     writeFile file: 'argocd-app.yaml', text: appYaml
                    
//                     withCredentials([string(credentialsId: 'argocd-api-key', variable: 'ARGOCD_AUTH_TOKEN')]) {
//                         sh """
//                         curl -sSL -o /dev/null -w "%{http_code}" ${ARGOCD_SERVER}/api/v1/applications -H "Authorization: Bearer ${ARGOCD_AUTH_TOKEN}" -H "Content-Type: application/json" -d @argocd-app.yaml -X POST
//                         if [ $? -ne 200 ] && [ $? -ne 409 ]; then
//                             curl -sSL -o /dev/null -w "%{http_code}" ${ARGOCD_SERVER}/api/v1/applications/${appName} -H "Authorization: Bearer ${ARGOCD_AUTH_TOKEN}" -H "Content-Type: application/json" -d @argocd-app.yaml -X PUT
//                         fi
//                         """
//                     }
                    
//                     echo "ArgoCD Application URL: ${ARGOCD_SERVER}/applications/${appName}"
//                 }
//             }
//         }

//         stage('Clean Local Docker Image') {
//             steps {
//                 sh "docker rmi ${DOCKER_IMAGE}"
//             }
//         }
//     }

//     post {
//         always {
//             cleanWs()
//             sh "gcloud auth revoke --all"
//         }
//         success {
//             echo "Successfully built, pushed, and set up ArgoCD deployment for: ${DOCKER_IMAGE}"
//         }
//         failure {
//             echo "Failed in build/push/ArgoCD setup of: ${DOCKER_IMAGE}"
//         }
//     }
// }



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
        ARGOCD_AUTH_TOKEN = credentials('argocd-auth-token')
         ARGOCD_PASSWORD = credentials('argocd-password')
        REPO_URL = 'https://github.com/olagunjuraman/Itineray'
        GIT_CREDENTIALS = credentials('github-credentials')
        // KUBECONFIG = credentials('k8s-config')
    }

    stages {
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

        // stage('Update Kubernetes Manifests') {
        //     steps {
        //         sh """
        //             sed -i 's|image: .*|image: ${DOCKER_IMAGE}|' k8s/deployment.yml
        //             git config user.email 'jenkins@example.com'
        //             git config user.name 'Jenkins'
        //             git add k8s/deployment.yml
        //             git commit -m 'Update image to ${DOCKER_IMAGE}' || true
        //             git push origin HEAD:main
        //         """
        //     }
        // }


        stage('Update Kubernetes Manifests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh """
                        git config user.email 'jenkins@example.com'
                        git config user.name 'Jenkins'
                        sed -i 's|image: .*|image: ${DOCKER_IMAGE}|' k8s/deployment.yml
                        git add k8s/deployment.yml
                        git commit -m 'Update image to ${DOCKER_IMAGE}' || true
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/olagunjuraman/itineray.git HEAD:refs/heads/main
                    """
                }
            }
        }

  


        // stage('Create ArgoCD Repository and Application') {
        //     steps {
        //         script {
        //             def repoUrl = "https://github.com/olagunjuraman/itineray"
        //             def appName = "${IMAGE_NAME}-${K8S_NAMESPACE}"
        //             def gitUsername = GIT_CREDENTIALS_USR
        //             def gitPassword = GIT_CREDENTIALS_PSW
                    
        //             withCredentials([
        //                 file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE'),
        //                 string(credentialsId: 'argocd-auth-token', variable: 'ARGOCD_AUTH_TOKEN')
        //             ]) {
        //                 // Authenticate with GKE cluster
        //                 sh """
        //                 gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
        //                 gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project ${GCP_PROJECT_ID}
        //                 """

        //                 // Add repository to Argo CD
        //                 sh '''
      
        //                 argocd login  ${ARGOCD_SERVER}  --username admin --password  ${ARGOCD_PASSWORD} --insecure

        //                 argocd repo add https://github.com/olagunjuraman/Itineray --name itinerary --type git --username ${gitUsername} --password ${gitPassword}
                     
        //                 '''

        //                 // Create Argo CD application
        //                 sh """
        //                 argocd app create ${appName} \
        //                     --repo ${repoUrl} \
        //                     --path . \
        //                     --dest-server https://kubernetes.default.svc \
        //                     --dest-namespace ${K8S_NAMESPACE} \
        //                     --sync-policy automated
        //                 """
        //             }
                    
        //             echo "ArgoCD Application URL: ${ARGOCD_SERVER}/applications/${appName}"
        //         }
        //     }
        // }

// stage('Create ArgoCD Repository and Application') {
//     steps {
//         script {
//             def repoUrl = "https://github.com/olagunjuraman/itineray"
//             def appName = "${IMAGE_NAME}-${K8S_NAMESPACE}"
            
//             withCredentials([
//                 file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE'),
//                 usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD'),
//                 usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')
//             ]) {
//                 // Authenticate with GKE cluster
//                 sh """
//                 gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
//                 gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project ${GCP_PROJECT_ID}
//                 """

//                 // Login to ArgoCD
//                 sh """
//                 argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USERNAME} --password ${ARGOCD_PASSWORD} --insecure
//                 """

//                 // Add repository to ArgoCD
//                 sh """
//                 argocd repo add ${repoUrl} --name itinerary --type git --username ${GIT_USERNAME} --password ${GIT_PASSWORD}
//                 """

//                 // Create ArgoCD application
//                 sh """
//                 argocd app create ${appName} \
//                     --repo ${repoUrl} \
//                     --path . \
//                     --dest-server https://kubernetes.default.svc \
//                     --dest-namespace ${K8S_NAMESPACE} \
//                     --sync-policy automated
//                 """
//             }
            
//             echo "ArgoCD Application URL: ${ARGOCD_SERVER}/applications/${appName}"
//         }
//     }
// }




stage('Create ArgoCD Repository and Application') {
    steps {
        script {
            def repoUrl = "https://github.com/olagunjuraman/itineray"
            def appName = "${IMAGE_NAME}-${K8S_NAMESPACE}"
            
            withCredentials([
                file(credentialsId: 'gcr-json-key', variable: 'GCP_KEY_FILE'),
                usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME'),
                usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')
            ]) {
                // Authenticate with GKE cluster
                sh """
                gcloud auth activate-service-account --key-file=${GCP_KEY_FILE}
                gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project ${GCP_PROJECT_ID}
                """

                // Login to ArgoCD
                sh """
                argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USERNAME} --password ${ARGOCD_PASSWORD} --insecure
                """

               // Add repository to ArgoCD
                // sh """
                // argocd repo add https://${GIT_USERNAME}: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@github.com/olagunjuraman/itineray.git --name itinerary --type git
                // """

                // Create ArgoCD application
                sh """
                argocd app create ${appName} \
                    --repo ${repoUrl} \
                    --path . \
                    --dest-server https://kubernetes.default.svc \
                    --dest-namespace ${K8S_NAMESPACE} \
                    --sync-policy automated
                """
            }
            
            echo "ArgoCD Application URL: ${ARGOCD_SERVER}/applications/${appName}"
        }
    }
}

    }

   
}