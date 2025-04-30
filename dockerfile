# 选择官方 Node 镜像
FROM node:20-bullseye

# 安装 Rust（用于编译 Move）
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# 安装 Move CLI
RUN git clone https://github.com/move-language/move.git /move-source \
    && cd /move-source \
    && cargo install --path language/tools/move-cli

# 创建工作目录
WORKDIR /app

# 复制 pnpm 配置
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建 Next.js
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["pnpm", "start"]