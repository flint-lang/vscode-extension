FROM node:18
WORKDIR /app
RUN npm install -g yo generator-code vsce
CMD ["bash"]

