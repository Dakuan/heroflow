# Heroflow
[![Circle CI](https://circleci.com/gh/Dakuan/heroflow.svg?style=svg&circle-token=f5e16ddad4d184eeae9f4861bb6b0c17129e964d)](https://circleci.com/gh/Dakuan/heroflow)

Github flow via heroku.

Github flow mandates that all commits to the master branch are shipped immediately. Instead of traditional development and staging environments, each feature should have it's own environment, with constant rebasing ensuring that integration issues are trapped early. 

Heroflow aims to make this easy for you.

## How it works
Heroflow tracks Github pull requests. When a pull request is created, heroflow creates, configures and manages an instance of your application running on heroku.

### The flow

* You reate a pull request on Github
* Heroflow provisions, configures and deploys your app on Heroku
* You add commits to your pull request
* Heroflow deploys updates to the Heroku app
* You merge your feature and delete the pull request
* Heroflow deletes the Heroku app
* Heroflow dutifully waits for your next pull request to be opened