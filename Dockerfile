# 指定环境
FROM node:16
# 运行 bash 命令
RUN mkdir -p /usr/src/app
# 指定工作区, 后面运行命令都在这个工作区内执行
WORKDIR /usr/scr/app
# c从本地拷贝文件到工作区
COPY . /usr/scr/app/
# 安装依赖
RUN npm install
# 暴露端口
EXPOSE 3000
# 执行命令, 一个 dockerfile 只有一个
CMD node server.js
