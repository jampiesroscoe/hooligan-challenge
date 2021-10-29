'use strict';

require('dotenv').config({ path: './.env' });

const isEmpty = require('lodash.isempty');
const validator = require('validator');
const connectToDatabase = require('./db');
const Streams = require('./models/user-streams');

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    error: message || 'An Error occurred.',
  }),
});

const returnError = (error) => {
  console.log(error);
  if (error.name) {
    const message = `Invalid ${error.path}: ${error.value}`;
    callback(null, createErrorResponse(400, `Error:: ${message}`));
  } else {
    callback(
      null,
      createErrorResponse(error.statusCode || 500, `Error:: ${error.name}`)
    );
  }
};

module.exports.create = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (isEmpty(event.body)) {
    return callback(null, createErrorResponse(400, 'Missing details'));
  }
  const { userId, sessionIds, noOfStreams } = JSON.parse(
    event.body
  );

  const streamObj = new Streams({
    userId, sessionIds, noOfStreams
  });

  if (streamObj.validateSync()) {
    return callback(null, createErrorResponse(400, 'Incorrect user details'));
  }

  try {
    await connectToDatabase();
    console.log(streamObj);
    const streams = await Streams.create(streamObj);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(streams),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getOne = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userId = event.pathParameters.userId;
  if (!validator.isAlphanumeric(userId)) {
    callback(null, createErrorResponse(400, 'Incorrect userId.'));
    return;
  }

  try {
    await connectToDatabase();
    const stream = await Streams.findOne({userId:userId});

    if (!stream) {
      callback(null, createErrorResponse(404, `No users found with id: ${userId}`));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(stream),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getAll = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    const streams = await Streams.find();
    if (!streams) {
      callback(null, createErrorResponse(404, 'No users Found.'));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(streams),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.update = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  if (isEmpty(data)) {
    return callback(null, createErrorResponse(400, 'Missing details'));
  }
  const { userId, sessionIds, noOfStreams } = data;

  try {
    await connectToDatabase();

    const stream = await Streams.findById(event.pathParameters.userId);

    if (stream) {
      stream.userId = userId || stream.userId;
      stream.sessionIds = sessionIds || stream.sessionIds;
      stream.noOfStreams = noOfStreams || stream.noOfStreams;
    }

    const newStream = await stream.save();

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newStream),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.delete = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userId = event.pathParameters.userId;
  try {
    await connectToDatabase();
    const stream = await Streams.findByIdAndRemove(userId);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed user with id: ${stream._userId}`,
        stream,
      }),
    });
  } catch (error) {
    returnError(error);
  }
};