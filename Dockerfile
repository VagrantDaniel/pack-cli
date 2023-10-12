FROM wanye101231/docker-nodejs-base-image:0.0.3

LABEL maintainer="wanye <inception00@163.com>"

ARG BUILD_TAG=latest
ARG TAG
ARG CI_PROJECT_ID
ARG CI_JOB_ID

RUN mkdir -p /root
WORKDIR /root

COPY . /root

RUN npm install && npm link && npm i lerna@5.3.0 -g && npm shrinkwrap && ls

RUN pack -V\
  && lerna -v
