#!groovy
@Library('blockchyp-pipelines') _

pipeline {
  agent {
    docker { image 'node:9-alpine' }
  }

  environment {
    HOME = '.'
  }

  stages {
    stage('Start') { steps {
      notifySlack 'Started'
    }}
    stage('Test') { steps {
      sh 'npm prune'
      sh 'npm install'
      sh 'npm test'
    }}
    stage('Build') { steps {
      sh 'npm run prod'
    }}
  }

  post {
    always {
      notifySlack
    }
  }
}
