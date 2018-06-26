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
      notify 'Started'
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
      notify currentBuild
    }
  }
}
