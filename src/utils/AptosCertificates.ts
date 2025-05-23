import { Account, Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants, PublicKey, SigningScheme } from "@aptos-labs/ts-sdk";

const MODULE_ADDRESS = "86314c7111dfd122845a1de317550ffd4371c18e9dfe9c316597ef9ed1c8ee76";
const MODULE_NAME = "certificates";

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
        network: Network.TESTNET,
    });
    this.client = new Aptos(config);
    const privateKey = new Ed25519PrivateKey(PrivateKey.formatPrivateKey("0xa3698a77cfcec96685bd401e957c6560216f5573aa51ea26fd3334330bda905f", PrivateKeyVariants.Ed25519))
    this.adminAccount = Account.fromPrivateKey({
        privateKey: privateKey,
        address: "86314c7111dfd122845a1de317550ffd4371c18e9dfe9c316597ef9ed1c8ee76"
    });
  }

  // 初始化学生账户
  async initializeStudent(account: Account) {
    const transaction = await this.client.transaction.build.simple({
        sender: "86314c7111dfd122845a1de317550ffd4371c18e9dfe9c316597ef9ed1c8ee76",
        data: {
            function: `${MODULE_ADDRESS}::${MODULE_NAME}::initialize_student`,
            typeArguments: [],
            functionArguments: [account.accountAddress]
        }
    });
    const adminSenderAuthenticator = this.client.transaction.sign({
        signer: this.adminAccount,
        transaction: transaction
    })
    const simulate = await this.client.transaction.submit.simple({
        transaction: transaction,
        senderAuthenticator: adminSenderAuthenticator
    });
    const executedTransaction = await this.client.waitForTransaction({
        transactionHash: simulate.hash
    });
    console.log(executedTransaction);
  }

  // 颁发证书（需要管理员账户）
  async issueCertificate(
    student_addr: string,
    course_id: string,
    credits: number
  ) {
    // 格式化钱包地址，确保为64位
    const formattedStudentAddr = formatAptosAddress(student_addr);
    const certificateStr = `${course_id}-${credits}`;
    const certificateHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(certificateStr));
    const certificateHashArray = Array.from(new Uint8Array(certificateHash));
    const transaction = await this.client.transaction.build.simple({
        sender: "86314c7111dfd122845a1de317550ffd4371c18e9dfe9c316597ef9ed1c8ee76",
        data: {
            function: `${MODULE_ADDRESS}::${MODULE_NAME}::issue_certificate`,
            typeArguments: [],
            functionArguments: [formattedStudentAddr, course_id, certificateHashArray, credits]
        }
    })
    const adminSenderAuthenticator = this.client.transaction.sign({
        signer: this.adminAccount,
        transaction: transaction
    })
    const simulate = await this.client.transaction.submit.simple({
        transaction: transaction,
        senderAuthenticator: adminSenderAuthenticator
    });
    const executedTransaction = await this.client.waitForTransaction({
        transactionHash: simulate.hash
    });
    console.log("证书颁发成功", executedTransaction);
  }

  // 查询学生证书
//   async getCertificates(student_addr: string) {
//     const viewPayload = {
//       function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_certificates`,
//       type_arguments: [],
//       arguments: [student_addr],
//     };
//     const result = await this.client.view(viewPayload);
//     return result;
//   }

//   // 查询学生总学分
//   async getTotalCredits(student_addr: string) {
//     const viewPayload = {
//       function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_total_credits`,
//       type_arguments: [],
//       arguments: [student_addr],
//     };
//     return this.client.view(viewPayload);
//   }
}

export const aptosClient = new AptosCertificates();