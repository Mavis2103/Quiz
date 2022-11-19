# 1. For build React app
FROM node:lts AS development
# Set working directory
WORKDIR /app
#
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
# Same as npm install
RUN yarn
COPY . /app
RUN [ "yarn", "build" ]

FROM development as build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
