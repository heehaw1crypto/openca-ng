FROM ubuntu:20.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Update stuff
RUN apt-get update --fix-missing
RUN apt-get install -y build-essential libssl-dev checkinstall \
    curl wget git gnupg nano vim htop -y

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.15.4

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# install global node stuff
RUN npm install -g ts-node yarn nodemon mocha openapi-sdk-generator pm2

# Install mysql CLI
RUN apt-get install default-mysql-client -y

# set up persisted workspace
RUN mkdir /workspace
WORKDIR /workspace

VOLUME /workspace-dev

CMD ["/bin/sh"]