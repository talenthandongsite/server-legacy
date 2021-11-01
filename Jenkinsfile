pipeline {
    agent any

     //Cron Syntax
     // drive this pipeline every 3 minutes
    triggers {
        pollSCM('*/3 * * * *')
    }

    // Credentials file 
    environment {
        AWS_ACCESS_KEY_ID = credentials('awsAccessKeyId')
        AWS_SECRET_ACCESS_KEY = credentials('awsSecretAccessKey')
        AWS_DEFAULT_REGION = 'ap-northeast-2'
        HOME = '.' // Avoid npm root owned
        GIT_URL= 'https://github.com/talenthandongsite/server'
        APP_NAME= 'talent-server'
        NETWORK='talent-private'
    }
    
    stages {
        // Download Repository

        stage('Prepare'){
            agent any

            steps {
                echo "Let's start Long Journey ! 🙌 "
                echo "Clonning Repository..."

                git url: "${GIT_URL}",
                    branch: "master",
                    credentialsId: 'git-jenkins'
            }


            // Define the behavior after above steps
            post {
                //If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.

                success {
                    echo 'Successfully Cloned Repository'
                }

                always {
                    echo "I tried..."
                }

                cleanup {
                    echo "after all other post conditipon"
                }
            }
        }


        stage('Build Docker') {
            agent any 

            steps {
                dir('./'){
                    sh "docker build . -t ${APP_NAME}"
                }
            }
        }

        stage('Deploy Nest'){
            agent any

            steps {
                echo "Deploy ${APP_NAME}"

                sh "docker ps -f name=talent-server -q | xargs --no-run-if-empty docker container stop"
                sh "docker container ls -a -fname=talent-server -q | xargs -r docker container rm"
                sh "docker images --no-trunc --all --quiet --filter='dangling=true' | xargs --no-run-if-empty docker rmi"
                sh """
                docker run --network ${NETWORK} --expose 3000 -d --name ${APP_NAME} ${APP_NAME}
                """

            }

            post {
                success {
                    slackSend (channel: 'deploy-alert', color: '#00FF00', message: "Successfully Deployed! : Job ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL})")
                }
                failure {
                    success {
                    slackSend (channel: 'deploy-alert', color: '##FF0000', message: "Deploy Failed! : Job ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL})")
                }
                }
            }

        }

    

       

    }
}