# Grailed Monitor
This is a pretty basic monitor to get live updates when a product is updated or is listed on https://grailed.com.

## Requirements
- MongoDB
- Node
- Docker #optional

## Setup NodeJS
- `cd /app`
- Edit the config file in `/app/config.js`
- `npm install`
- `npm run start`

## Setup Docker
- Edit the config file in `/app/config.js`
- `Docker build .`
- `Docker run -d <IMAGE-NAME>`

## Todo
- Make the query value in config nicer 😆
- 🤷🏾‍♂️