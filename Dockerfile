# Dockerfile
FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

# 构建参数，用于传递特定的端口号
ARG PORT

# 设置环境变量，用于应用程序使用
ENV PORT=${PORT}


RUN npm install

COPY . .

# 暴露指定端口号
EXPOSE ${PORT}

CMD ["npm" ,"run" ,"start"]
