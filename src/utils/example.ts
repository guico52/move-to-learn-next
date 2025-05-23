import { aptosClient } from './AptosCertificates';

async function demonstrateUsage() {
  try {
    console.log("=== Aptos 证书系统使用示例 ===");

    // 1. 初始化合约（只需要管理员执行一次）
    console.log("\n1. 初始化合约...");
    await aptosClient.initialize();

    // 2. 创建用户账户
    console.log("\n2. 创建用户账户...");
    const userAccount = aptosClient.createUserAccount();
    console.log("用户地址:", userAccount.accountAddress.toString());
    console.log("用户私钥:", userAccount.signingScheme);

    // 3. 为用户账户申请测试代币（用于支付 gas）
    console.log("\n3. 为用户申请测试代币...");
    await aptosClient.fundAccount(userAccount.accountAddress.toString());

    // 4. 设置课程信息
    console.log("\n4. 设置课程信息...");
    await aptosClient.setCourse(
      "blockchain_101",
      100,
      "https://example.com/course/blockchain_101/metadata.json"
    );

    // 5. 获取课程信息
    console.log("\n5. 获取课程信息...");
    const courseInfo = await aptosClient.getCourseInfo("blockchain_101");
    console.log("课程信息:", courseInfo);

    // 6. 为用户颁发证书和代币
    console.log("\n6. 为用户颁发证书和代币...");
    await aptosClient.mintCertificateAndCoins(userAccount, "blockchain_101", 50);

    // 7. 查看用户代币余额
    console.log("\n7. 查看用户代币余额...");
    const balance = await aptosClient.viewUserBalance(userAccount.accountAddress.toString());
    console.log("用户代币余额:", balance);

    // 8. 查看用户证书
    console.log("\n8. 查看用户证书...");
    const certificates = await aptosClient.viewUserCertificates(userAccount.accountAddress.toString());
    console.log("用户证书:", certificates);

    // 9. 查看证书统计
    console.log("\n9. 查看证书统计...");
    const stats = await aptosClient.viewCertificateStats("blockchain_101");
    console.log("证书统计:", stats);

    // 10. 查看代币总供应量
    console.log("\n10. 查看代币总供应量...");
    const totalSupply = await aptosClient.viewTotalCoinSupply();
    console.log("代币总供应量:", totalSupply);

    console.log("\n=== 示例完成 ===");

  } catch (error) {
    console.error("示例执行失败:", error);
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  demonstrateUsage();
}

export { demonstrateUsage }; 