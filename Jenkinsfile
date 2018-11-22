#!groovy
@Library('blockchyp-pipelines') _

pipeline {
  agent none

  stages {
    stage('Start') {
      agent {
        node { label 'docker' }
      }
      steps {
        notifySlack 'Started'
      }
    }

    stage('Build Node') {
      agent {
        docker {
          image 'node:9-alpine'
        }
      }

      environment {
        HOME = '.'
      }

      stages {
        stage('Test') {
          steps {
            sh 'npm prune'
            sh 'npm install'
            sh 'npm test'
          }
        }

        stage('Build') {
          steps {
            sh 'npm run prod'
          }
        }
      }
    }

    stage('SonarQube') {
      agent {
        node { label 'docker' }
      }

      steps {
        withSonarQubeEnv('SonarQubeDev') {
          sh "${tool 'SonarQube Scanner 3.2.0.1227'}/bin/sonar-scanner"
        }
      }
    }
  }

  post {
    always {
      notifySlack()
    }
  }
}
