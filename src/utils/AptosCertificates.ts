import { Account, Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { CourseMeta, CertificateInfo } from './types';

const MODULE_ADDRESS = "dev"; // 更改为新的模块地址
const MODULE_NAME = "certificate"; // 更改为新的模块名

// 工具函数：格式化 Aptos 地址为 64 位十六进制字符串
function formatAptosAddress(address: string): string {
  let addr = address.startsWith("0x") ? address.slice(2) : address;
  addr = addr.padStart(64, "0");
  return "0x" + addr;
}

export class AptosCertificates {
  client: Aptos;
  adminAccount: Account;

  constructor() {
    const config = new AptosConfig({
        network: Network.DEVNET,
    });
    this.client = new Aptos(config);
    const privateKey = new Ed25519PrivateKey(PrivateKey.formatPrivateKey("0xa3698a77cfcec96685bd401e957c6560216f5573aa51ea26fd3334330bda905f", PrivateKeyVariants.Ed25519))
    this.adminAccount = Account.fromPrivateKey({
        privateKey: privateKey,
        address: "86314c7111dfd122845a1de317550ffd4371c18e9dfe9c316597ef9ed1c8ee76" // 保持原来的管理员地址
    });
  }

  // 初始化智能合约
  async initialize() {
    try {
      const transaction = await this.client.transaction.build.simple({
          sender: this.adminAccount.accountAddress,
          data: {
              function: `${MODULE_ADDRESS}::${MODULE_NAME}::initialize`,
              typeArguments: [],
              functionArguments: []
          }
      });
      
      const adminSenderAuthenticator = this.client.transaction.sign({
          signer: this.adminAccount,
          transaction: transaction
      });
      
      const simulate = await this.client.transaction.submit.simple({
          transaction: transaction,
          senderAuthenticator: adminSenderAuthenticator
      });
      
      const executedTransaction = await this.client.waitForTransaction({
          transactionHash: simulate.hash
      });
      
      console.log("合约初始化成功", executedTransaction);
      return executedTransaction;
    } catch (error) {
      console.error("合约初始化失败:", error);
      throw error;
    }
  }

  // 设置/更新课程信息
  async setCourse(courseId: string, points: number, metadataUri: string) {
    try {
      const transaction = await this.client.transaction.build.simple({
          sender: this.adminAccount.accountAddress,
          data: {
              function: `${MODULE_ADDRESS}::${MODULE_NAME}::set_course`,
              typeArguments: [],
              functionArguments: [courseId, points, metadataUri]
          }
      });
      
      const adminSenderAuthenticator = this.client.transaction.sign({
          signer: this.adminAccount,
          transaction: transaction
      });
      
      const simulate = await this.client.transaction.submit.simple({
          transaction: transaction,
          senderAuthenticator: adminSenderAuthenticator
      });
      
      const executedTransaction = await this.client.waitForTransaction({
          transactionHash: simulate.hash
      });
      
      console.log("课程设置成功", executedTransaction);
      return executedTransaction;
    } catch (error) {
      console.error("课程设置失败:", error);
      throw error;
    }
  }

  // 删除课程
  async removeCourse(courseId: string) {
    try {
      const transaction = await this.client.transaction.build.simple({
          sender: this.adminAccount.accountAddress,
          data: {
              function: `${MODULE_ADDRESS}::${MODULE_NAME}::remove_course`,
              typeArguments: [],
              functionArguments: [courseId]
          }
      });
      
      const adminSenderAuthenticator = this.client.transaction.sign({
          signer: this.adminAccount,
          transaction: transaction
      });
      
      const simulate = await this.client.transaction.submit.simple({
          transaction: transaction,
          senderAuthenticator: adminSenderAuthenticator
      });
      
      const executedTransaction = await this.client.waitForTransaction({
          transactionHash: simulate.hash
      });
      
      console.log("课程删除成功", executedTransaction);
      return executedTransaction;
    } catch (error) {
      console.error("课程删除失败:", error);
      throw error;
    }
  }

  // 颁发证书和代币给用户
  async mintCertificateAndCoins(userAccount: Account, courseId: string, coinAmount: number) {
    try {
      const transaction = await this.client.transaction.build.multiAgent({
          sender: this.adminAccount.accountAddress,
          secondarySignerAddresses: [userAccount.accountAddress],
          data: {
              function: `${MODULE_ADDRESS}::${MODULE_NAME}::mint_certificate_and_coins`,
              typeArguments: [],
              functionArguments: [courseId, coinAmount]
          }
      });
      const transactionHex = transaction.bcsToHex()
      
      const adminSenderAuthenticator = this.client.transaction.sign({
          signer: this.adminAccount,
          transaction: transaction
      });
      
      const userSenderAuthenticator = this.client.transaction.sign({
          signer: userAccount,
          transaction: transaction
      });
      
      const simulate = await this.client.transaction.submit.multiAgent({
          transaction: transaction,
          senderAuthenticator: adminSenderAuthenticator,
          additionalSignersAuthenticators: [userSenderAuthenticator]
      });
      
      const executedTransaction = await this.client.waitForTransaction({
          transactionHash: simulate.hash
      });
      
      console.log("证书和代币颁发成功", executedTransaction);
      return executedTransaction;
    } catch (error) {
      console.error("证书和代币颁发失败:", error);
      throw error;
    }
  }

  // ================= 查看函数 =================

  // 获取课程信息
  async getCourseInfo(courseId: string): Promise<CourseMeta> {
    try {
      const result = await this.client.view({
        payload: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_course_info`,
          typeArguments: [],
          functionArguments: [courseId]
        }
      });
      
      return {
        points: Number(result[0]),
        metadata_uri: result[1] as string
      };
    } catch (error) {
      console.error("获取课程信息失败:", error);
      throw error;
    }
  }

  // 查看用户证书
  async viewUserCertificates(userAddress: string) {
    try {
      const formattedUserAddr = formatAptosAddress(userAddress);
      const result = await this.client.view({
        payload: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::view_user_certificates`,
          typeArguments: [],
          functionArguments: [formattedUserAddr]
        }
      });
      
      return result;
    } catch (error) {
      console.error("查看用户证书失败:", error);
      throw error;
    }
  }

  // 查看用户代币余额
  async viewUserBalance(userAddress: string): Promise<number> {
    try {
      const formattedUserAddr = formatAptosAddress(userAddress);
      const result = await this.client.view({
        payload: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::view_user_balance`,
          typeArguments: [],
          functionArguments: [formattedUserAddr]
        }
      });
      
      return Number(result[0]);
    } catch (error) {
      console.error("查看用户余额失败:", error);
      throw error;
    }
  }

  // 查看证书统计
  async viewCertificateStats(courseId: string) {
    try {
      const result = await this.client.view({
        payload: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::view_certificate_stats`,
          typeArguments: [],
          functionArguments: [courseId]
        }
      });
      
      return result;
    } catch (error) {
      console.error("查看证书统计失败:", error);
      throw error;
    }
  }

  // 查看代币总供应量
  async viewTotalCoinSupply(): Promise<number | null> {
    try {
      const result = await this.client.view({
        payload: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::view_total_coin_supply`,
          typeArguments: [],
          functionArguments: []
        }
      });
      
      return result[0] ? Number(result[0]) : null;
    } catch (error) {
      console.error("查看代币总供应量失败:", error);
      throw error;
    }
  }

  // ================= 工具函数 =================

  // 创建新用户账户
  createUserAccount(): Account {
    return Account.generate();
  }

  // 从私钥恢复账户
  restoreAccountFromPrivateKey(privateKeyHex: string): Account {
    const privateKey = new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyHex, PrivateKeyVariants.Ed25519));
    return Account.fromPrivateKey({ privateKey });
  }

  // 获取账户余额 (APT)
  async getAccountBalance(accountAddress: string): Promise<number> {
    try {
      const balance = await this.client.getAccountCoinAmount({
        accountAddress,
        coinType: "0x1::aptos_coin::AptosCoin"
      });
      return balance;
    } catch (error) {
      console.error("获取账户余额失败:", error);
      return 0;
    }
  }

  // 为账户申请测试代币
  async fundAccount(accountAddress: string): Promise<void> {
    try {
      await this.client.fundAccount({ 
        accountAddress, 
        amount: 100000000 // 1 APT = 100,000,000 octas
      });
      console.log(`为账户 ${accountAddress} 申请测试代币成功`);
    } catch (error) {
      console.error("申请测试代币失败:", error);
      throw error;
    }
  }
}

export const aptosClient = new AptosCertificates();