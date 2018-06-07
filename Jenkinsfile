#!groovy
@Library('blockchyp-pipelines') _

pipeline {
  agent {
    docker { image 'node:9-alpine' }
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
      sh 'npm run build'
    }}
  }

  post {
    always {
      notify currentBuild
    }
  }
}
