FROM node:20-bullseye

# 安装 Rust 及 Move CLI 所需依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    clang \
    libssl-dev \
    pkg-config \
    git \
    curl \
    ca-certificates

# 安装 Rust（nightly 版，Move 推荐）
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly
ENV PATH="/root/.cargo/bin:${PATH}"

# 克隆 Move 源码并安装 move-cli
RUN git clone https://github.com/move-language/move.git /move-source \
    && cd /move-source \
    && git checkout main \
    && cargo +nightly install --path language/tools/move-cli

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
# 生成 Prisma 客户端
RUN npx prisma generate
# 构建 Next.js
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动服务

CMD ["pnpm", "start"]