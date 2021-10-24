# hooligan-challenge
A service to check how many video streams a given user is watching and prevent a user from watching more than 3 video streams concurrently.
Assumptions: each user has 1 account with a related userId, user can log into multiple devices to stream with 1 account. With each login a sessionId is generated, this is used to differentiate between the different streams a user watches on different devices. A user can stop one stream and start another in the same session, this would count as one stream. User cannot have more than 3 seperate sessions watching a stream.

Loopback 4 was used to build this service.

## Install dependencies

To install dependencies run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser. To view the explorer and test the service.

## Tests

```sh
npm test
```

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container


## Improvements
To improve the service, the controller needs to be refactored, the logic should be cleaned up and moved to a helperClass or a serviceClass instead of the controller. I would add more validations for the request and response. I would also add authorization either basic auth or jwt tokens depending on the client using the service.

More fields could also be added, such as more user details and stream details to improve functionality of the service.
### Scaling
To scale this solution a different storage method should be used, currently in-memory storage is used and a .json file is used for persistance. I would suggest using a Redis-cache to store the data as it is fast and can be cleared easily which is ideal for this service. 

This service is already "containerized" so it is ready for deployment.

For it to be ready for production I would set up a CI/CD pipeline for this on gitlab. With 5 stages: validate, test, build, security and deploy.
In the validate stage I would run linting, npm audit, use sonarqube to check coding standards.
In the test stage I would run all the automated tests.
In the build stage the docker container would be built.
In the security stage I would use a tool like Clair to scan the container for vulnerabilities.
If all the stages pass, the container would then be deployed.
For a service that would have millions of users I would deploy this on 4 servers/vms, 2 production and 2 DR. I would then use a loadballancer such as Traefik to ballance the load between the 2 prod instances and the DR incase of prod failures.


### logging and monitoring at scale
For logging when there are millions of users I would implement a seperate logging service using the ELK stack/Elastic stack. Log files from all servers would be sent to a buffer/message queue such as RabbitMQ, the logs will then be consumed by a service which will post the logs to Logstash for processing then stored in elastisearch. Visualisations would then be created on Kibana. 

For monitoring, I would use tools such as sentry and uptime robot. I would also build email and telegram alerts into the service. If the service fails for 10 users it would send a telegram message and an email to the team to investigate. 
