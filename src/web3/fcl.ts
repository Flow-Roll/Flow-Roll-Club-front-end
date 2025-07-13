import * as fcl from "@onflow/fcl";

export const FLOW_CONFIG = {
accessNodeURL : "https://rest-testnet.onflow.org",
flowNetwork : "testnet",
appDetailTitle: "Flow Roll Club",
appDetailIcon: "https://flowroll.club/logo2.webp",
appDetailDescription: "Perpetual and ownable betting games",
appDetailUrl: "https://flowroll.club"
}

fcl.config({
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
    "accessNode.api": FLOW_CONFIG.accessNodeURL
})


// export const ethereumProvider = createProvider({
//     // user: null,

//     rpcUrls: {
//         545: "https://testnet.evm.nodes.onflow.org"
//     }
// })


//https://github.com/onflow/flips/blob/main/protocol/20231116-evm-support.md

//TODO: JUST USE THIS:
// function CrossVmBatchTransactionExample() {
//     const { sendBatchTransaction, isPending, error, data: txId } = useCrossVmBatchTransaction({
//         mutation: {
//             onSuccess: (txId) => console.log("TX ID:", txId),
//         },
//     })

//     const sendTransaction = () => {
//         const calls = [
//             {
//                 address: "0x1234567890abcdef",
//                 abi: {
//                     // ABI definition for the contract
//                 },
//                 functionName: "transfer",
//                 args: ["0xabcdef1234567890", 100n], // Example arguments
//                 gasLimit: 21000n, // Example gas limit
//             },
//             // Add more calls as needed
//         ]

//         sendBatchTransaction({ calls })

        
//     }
// }
 