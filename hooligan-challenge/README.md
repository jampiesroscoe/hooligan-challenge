# hooligan-challenge

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

Open http://127.0.0.1:3000 in your browser. To view the explorer and test the service using the explorer.

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


## What's next

### Scaling
To scale this solution a different storage method should be used, currently in-memory storage is used and a .json file is used for persistance. I would suggest using a Redis-cache to store the data as it is fast and can be cleared easily which is ideal for this service. 


### logging and monitoring at scale
For logging when there are millions of users I would implement a seperate logging service. This service would fire and forget a log file with all the 

