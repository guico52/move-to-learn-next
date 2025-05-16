# 使用 Ubuntu 22.04 作为基础镜像
FROM ubuntu:22.04

# 设置环境变量
ENV DEBIAN_FRONTEND=noninteractive
ENV RUST_VERSION=1.70.0
ENV PATH="/root/.cargo/bin:${PATH}"

# 1. 安装基础依赖
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    cmake \
    clang \
    && rm -rf /var/lib/apt/lists/*

# 2. 安装 Rust (使用官方安装脚本)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    --default-toolchain $RUST_VERSION \
    --profile minimal \
    --no-modify-path

# 3. 配置 Rust 环境
RUN echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc && \
    . ~/.bashrc && \
    rustup component add rustfmt clippy && \
    rustup target add riscv64imac-unknown-none-elf && \
    rustup component add llvm-tools-preview rust-src

# 4. 验证安装
RUN . ~/.bashrc && rustc --version && cargo --version

# 5. 安装 Move 工具链
WORKDIR /tmp
RUN git clone https://github.com/move-language/move && \
    cd move && \
    yes | ./scripts/dev_setup.sh -ypt  && \
    cargo install --path language/tools/move-cli

# 6. 安装 Aptos CLI
RUN curl -fsSL "https://aptos.dev/scripts/install_cli.sh" | bash

# 7. 安装 Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm

# 8. 清理缓存
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# 设置工作目录
WORKDIR /app

CMD ["bash"]