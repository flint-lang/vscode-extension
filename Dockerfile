FROM node:20
WORKDIR /app
RUN npm install -g yo generator-code @vscode/vsce ovsx
CMD ["bash"]

