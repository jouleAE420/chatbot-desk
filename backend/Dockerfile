# Image size ~ 400MB
FROM node:22.12.0-alpine3.20

WORKDIR /project

COPY . /project
COPY tsconfig.json /project

RUN npm install


# RUN npm install -g ts-node \
#     RUN apk add --no-cache --virtual .gyp \
#     python3 \
#     make \
#     g++ \
#     && apk add --no-cache git \
#     && npm install \
#     && npm install -g typescript 
# && tsc 
# && npm run build --verbose
# && apk del .gyp


# RUN tsc

# COPY . .

# FROM builder as deploy

# WORKDIR /

# ARG PORT
# ENV PORT $PORT
# EXPOSE $PORT

# COPY --from=builder /assets/ ./assets
# COPY --from=builder /dist/ ./dist
# COPY --from=builder /*.json ./
# COPY --from=builder /../../../ ./src

# RUN npm install --production --ignore-scripts \
#     && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
#     && npm cache clean --force


EXPOSE 3000

CMD ["npm", "run", "start", "0 */12 * * *"]