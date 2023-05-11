FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn --production --silent
RUN rm package.json yarn.lock
COPY ./ .
EXPOSE 3002
# CMD ["node --enable-source-maps ", "main.js"]