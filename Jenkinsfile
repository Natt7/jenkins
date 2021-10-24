pipeline {
    agent { docker { image 'node:14-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'npm install'
                sh 'npm run build'
                sh 'zip -r web.zip web'
            }
        }
    }
}