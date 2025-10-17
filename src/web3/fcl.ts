// in the browser
import * as fcl from '@onflow/fcl';

fcl.config({
    "app.detail.title": "Flow Roll Club", // your app name
    'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Endpoint set to Testnet
    "flow.network": "testnet",
    "accessNode.api": "https://rest-testnet.onflow.org",
    "walletconnect.projectId": "f948b2cf2a02539af6c817e1d7a99378"
});

export async function unauthenticate() {
    await fcl.unauthenticate()
}

export async function isUserLoggedIn() {
    const user = await fcl.currentUser.snapshot();
    return user && user.loggedIn
}

export async function authenticateFCL() {
    console.log("FCL authenticate")

    const user = await fcl.currentUser.snapshot();

    if (user && user.loggedIn) {
        console.log("✅ Already authenticated:", user.addr);
    } else {
        console.log("❌ Not authenticated");
        await fcl.authenticate();
    }
}

// 🧩 Define argument types
export type FundPrizePoolArgs = {
    bettingContractHex: string;
    flowValue: number | string; // UInt (but Flow expects strings)
    gasLimit: string;           // UInt64 — use string for safety
};


//TODO: Deposit into the COA automatically if the balance is too low!
//TODO: I need a roll button just in case something goes wrong, like the scheduled tx fails!

// 🚀 FCL mutate function
export async function fundPrizePool({
    bettingContractHex,
    flowValue,
    gasLimit,
}: FundPrizePoolArgs): Promise<string> {
    const txId = await fcl.mutate({
        cadence: `
      import EVM from 0x8c5303eaa26202d6

      transaction(
        bettingContractHex: String,
        flowValue: UInt,
        gasLimit: UInt64
      ) {
          let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

          prepare(signer: auth(SaveValue, BorrowValue) &Account) {
              if signer.storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm) == nil {
                  let newCOA <- EVM.createCadenceOwnedAccount()
                  signer.storage.save(<-newCOA, to: /storage/evm)
              }

              self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
                  from: /storage/evm
              ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
                  .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))
          }

          execute {
              let contractAddress = EVM.addressFromString(bettingContractHex)

              let value = EVM.Balance(attoflow: 0)
              value.setFLOW(flow: UFix64(flowValue))

              let calldata = EVM.encodeABIWithSignature(
                  "fundPrizePoolFLOW(uint256)",
                  [value.attoflow]
              )

              let result: EVM.Result = self.coa.call(
                  to: contractAddress,
                  data: calldata,
                  gasLimit: gasLimit,
                  value: value
              )

              var errorText = ""
              if result.status != EVM.Status.successful && result.data.length > 0 {
                  let decoded = EVM.decodeABIWithSignature("Error(string)", types: [Type<String>()], data: result.data)
                  errorText = decoded[0] as! String
              }

              assert(
                  result.status == EVM.Status.successful,
                  message: "fundPrizePoolFLOW call to ".concat(bettingContractHex)
                      .concat(" failed with error code ").concat(result.errorCode.toString())
                      .concat(": ")
                      .concat(result.errorMessage)
              )
          }
      }
    `,
        args: (arg, t) => [
            arg(bettingContractHex, t.String),
            arg(flowValue.toString(), t.UInt), // UInt expects stringified number
            arg(gasLimit, t.UInt64),
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 9999,
    });

    console.log("Transaction submitted:", txId);
    return txId;
}


type BuyNFTArgs = {
    contractAddress: string;
    flowCost: string;           // UFix64 -> must be a string like "10.0"
    name: string;
    coupon: string;
    erc20Address: string;
    winnerPrizeShare: number;   // UInt8
    diceRollCost: string;       // UFix64 -> string like "1.0"
    houseEdge: number;          // UInt8
    min: number;                // UInt16
    max: number;                // UInt16
    betType: number;            // UInt16
    gasLimit: number;           // UInt64 -> use string if it exceeds JS int range
};

function toUFix64(value: any) {
    // Convert number or string to a properly formatted UFix64 string
    const str = typeof value === "number" ? value.toString() : value;
    return str.includes(".") ? str : `${str}.0`;
}
export async function buyNFT(args: BuyNFTArgs) {
    console.log(args)
    const {
        contractAddress,
        flowCost,
        name,
        coupon,
        erc20Address,
        winnerPrizeShare,
        diceRollCost,
        houseEdge,
        min,
        max,
        betType,
        gasLimit,
    } = args
    // in the browser, FCL will automatically connect to the user's wallet to request signatures to run the transaction
    const txId = await fcl.mutate({
        cadence: `
    import EVM from 0x8c5303eaa26202d6
    
    transaction(
        contractAddress: String,
        flowCost: UFix64,
        name: String,
        coupon: String,
        erc20Address: String,
        winnerPrizeShare: UInt8,
        diceRollCost: UFix64,
        houseEdge: UInt8,
        min: UInt16,
        max: UInt16,
        betType: UInt16,
        gasLimit: UInt64
    ){
        let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount
        prepare(signer: auth(BorrowValue, SaveValue) &Account) {
            // Borrow or create a CadenceOwnedAccount (COA)
            if signer.storage.type(at: /storage/evm) == nil {
                let newCOA <- EVM.createCadenceOwnedAccount()
                signer.storage.save(<-newCOA, to: /storage/evm)
            }
            
            self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(from: /storage/evm)
                ?? panic("Could not borrow COA reference")        
        }

        execute{
            let evmContractAddress = EVM.addressFromString(contractAddress)
            var diceRollCostWei = EVM.Balance(attoflow: 0)
            diceRollCostWei.setFLOW(flow: diceRollCost)

            let functionSelector = EVM.encodeABIWithSignature(
            "buyNFT(string,string,address,uint8,uint256,uint8,uint16,uint16,uint16)",
            [name, coupon, EVM.addressFromString(erc20Address), winnerPrizeShare,diceRollCostWei.inAttoFLOW(),houseEdge,min,max,betType]
            )

            //Now I hardcode the prize in flow, 2000
            var weiAmount = EVM.Balance(attoflow: 0)
                weiAmount.setFLOW(flow: flowCost)

            let result = self.coa.call(
                    to: evmContractAddress,
                    data: functionSelector,
                    gasLimit: gasLimit,
                    value: weiAmount
                )

            assert(
                            result.status == EVM.Status.successful,
                            message: "buyNFT call to ".concat(contractAddress)
                                .concat(" failed with error code ").concat(result.errorCode.toString())
                                .concat(": ")
                                .concat(result.errorMessage)
                                .concat(" data ")
                                .concat(result.data.length.toString())
                                
                        )

        }
    }
  `,
        args: (arg, t) => [
            arg(contractAddress, t.String),
            arg(flowCost, t.UFix64),
            arg(name, t.String),
            arg(coupon, t.String),
            arg(erc20Address, t.String),
            arg(winnerPrizeShare, t.UInt8),
            arg(toUFix64(diceRollCost), t.UFix64),
            arg(houseEdge, t.UInt8),
            arg(min, t.UInt16),
            arg(max, t.UInt16),
            arg(betType, t.UInt16),
            arg(gasLimit, t.UInt64),
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 9999, // transaction computation limit
    });

    console.log("Transaction ID:", txId);
    return txId;
}

// ------------------------------
// TypeScript type for the function args
// ------------------------------
export type BetFlowAndScheduleArgs = {
    bettingContractHex: string; // EVM contract address in hex
    bet: string;                // UInt16
    flowValue: number | string; // UFix64 (string with decimal)
    gasLimit: string;           // UInt64
    delaySeconds: number | string; // UFix64
    priority: number;           // UInt8
    executionEffort: string;    // UInt64
    transactionData?: any;      // optional AnyStruct
};

// ------------------------------
// FCL mutate function
// ------------------------------
export async function betFlowAndScheduleReveal(args: BetFlowAndScheduleArgs): Promise<string> {
    const {
        bettingContractHex,
        bet,
        flowValue,
        gasLimit,
        delaySeconds,
        priority,
        executionEffort,
        transactionData,
    } = args;

    const txId = await fcl.mutate({
        cadence: `
      import FlowTransactionScheduler from 0x8c5303eaa26202d6
      import FlowTransactionSchedulerUtils from 0x8c5303eaa26202d6
      import FlowToken from 0x7e60df042a9c0868
      import FungibleToken from 0x9a0766d93b6608b7
      import EVM from 0x8c5303eaa26202d6
      import BettingTransactionHandler from 0x899f626a589afcb9

   
transaction(
    bettingContractHex: String,
    bet: UInt16,
    flowValue: UFix64,
    gasLimit: UInt64,
    delaySeconds: UFix64,
    priority: UInt8,
    executionEffort: UInt64,
    transactionData: AnyStruct?
){
   let coa: auth(EVM.Call) &EVM.CadenceOwnedAccount

   
    prepare(signer: auth(SaveValue,BorrowValue,IssueStorageCapabilityController,PublishCapability,GetStorageCapabilityController) &Account){
      // Check if COA exists, if not create it
      if signer.storage.borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm) == nil {
        let newCOA <- EVM.createCadenceOwnedAccount()
        signer.storage.save(<-newCOA, to: /storage/evm)
      }

      // Borrow an entitled reference to the COA from the storage location we saved it to
        self.coa = signer.storage.borrow<auth(EVM.Call) &EVM.CadenceOwnedAccount>(
            from: /storage/evm
        ) ?? panic("Could not borrow reference to the signer's CadenceOwnedAccount (COA). "
            .concat("Ensure the signer account has a COA stored in the canonical /storage/evm path"))

        let publicPathStr = "/public/BettingTransactionHandler_".concat(bettingContractHex)
        let publicPath = PublicPath(identifier: publicPathStr)!
        let storagePathStr = "/storage/BettingTransactionHandler_".concat(bettingContractHex)
        let storagePath = StoragePath(identifier: storagePathStr)!

        // Check if there is a public capability already
    
     let publicCapExists = signer.capabilities
        .get<&{FlowTransactionScheduler.TransactionHandler}>(publicPath)
        .check()
    
      if !publicCapExists{
        // Issue a capability for the COA
        let coaCap: Capability<auth(EVM.Call) &EVM.CadenceOwnedAccount> = signer.capabilities.storage
            .issue<auth(EVM.Call) &EVM.CadenceOwnedAccount>(/storage/evm)


        // Save a handler resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: storagePath) == nil {
            let handler <- BettingTransactionHandler.createHandler(
                bettingContractHex: bettingContractHex,
                gasLimit: gasLimit,
                coa: coaCap
            )
            signer.storage.save(<-handler, to: storagePath)
        }

     // Validation/example that we can create an issue a handler capability with correct entitlement for FlowTransactionScheduler
        let _ = signer.capabilities.storage
            .issue<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>(storagePath)

        // Issue a non-entitled public capability for the handler that is publicly accessible
        let publicCap = signer.capabilities.storage
            .issue<&{FlowTransactionScheduler.TransactionHandler}>(storagePath)
        // publish the capability
        signer.capabilities.publish(publicCap, at: publicPath)
      }

        //Now I can schedule the reveal transaction
        let future = getCurrentBlock().timestamp + delaySeconds

        let pr = priority == 0
            ? FlowTransactionScheduler.Priority.High
            : priority == 1
                ? FlowTransactionScheduler.Priority.Medium
                : FlowTransactionScheduler.Priority.Low

        // Get the entitled capability that will be used to create the transaction
        // Need to check both controllers because the order of controllers is not guaranteed
        var handlerCap: Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>? = nil
        if let cap = signer.capabilities.storage
                            .getControllers(forPath: storagePath)[0]
                            .capability as? Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}> {
            handlerCap = cap
        } else {
            handlerCap = signer.capabilities.storage
                            .getControllers(forPath: storagePath)[1]
                            .capability as! Capability<auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}>
        }

       // Save a manager resource to storage if not already present
        if signer.storage.borrow<&AnyResource>(from: FlowTransactionSchedulerUtils.managerStoragePath) == nil {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<-manager, to: FlowTransactionSchedulerUtils.managerStoragePath)

            // Create a capability for the Manager
            let managerCapPublic = signer.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(FlowTransactionSchedulerUtils.managerStoragePath)
            signer.capabilities.publish(managerCapPublic, at: FlowTransactionSchedulerUtils.managerPublicPath)
        }

           // Borrow the manager
        let manager = signer.storage.borrow<auth(FlowTransactionSchedulerUtils.Owner) &{FlowTransactionSchedulerUtils.Manager}>(from: FlowTransactionSchedulerUtils.managerStoragePath)
            ?? panic("Could not borrow a Manager reference from \(FlowTransactionSchedulerUtils.managerStoragePath)")

        // Withdraw fees
        let vaultRef = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("missing FlowToken vault")

        let est = FlowTransactionScheduler.estimate(
            data: transactionData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort
        )
        
        assert(
            est.timestamp != nil || pr == FlowTransactionScheduler.Priority.Low,
            message: est.error ?? "estimation failed"
        )

        let fees <- vaultRef.withdraw(amount: est.flowFee ?? 0.0) as! @FlowToken.Vault

        // Schedule through the manager
        let transactionId = manager.schedule(
            handlerCap: handlerCap ?? panic("Could not borrow handler capability"),
            data: transactionData,
            timestamp: future,
            priority: pr,
            executionEffort: executionEffort,
            fees: <-fees
        )

        log("Scheduled transaction id: ".concat(transactionId.toString()).concat(" at ").concat(future.toString()))
}

   //Runs the EVM call and places the bet!
    execute {
        // Deserialize the EVM address from the hex string
        let contractAddress = EVM.addressFromString(bettingContractHex)
        
        // Construct the calldata for betFlow(uint16 bet)
        let calldata = EVM.encodeABIWithSignature(
            "betFlow(uint16)",
            [bet]
        )
        
        // Define the value as EVM.Balance struct (this is the payable amount)
        let value = EVM.Balance(attoflow: 0)
        value.setFLOW(flow: flowValue)
        
        // Call the contract at the given EVM address with the bet parameter and FLOW value
        let result: EVM.Result = self.coa.call(
            to: contractAddress,
            data: calldata,
            gasLimit: gasLimit,
            value: value
        )

        // Revert the transaction if the call was not successful
        assert(
            result.status == EVM.Status.successful,
            message: "betFlow call to ".concat(bettingContractHex)
                .concat(" failed with error code ").concat(result.errorCode.toString())
                .concat(": ").concat(result.errorMessage)
        )
    }

}

    `,
        args: (arg, t) => [
            arg(bettingContractHex, t.String),
            arg(bet, t.UInt16),
            arg(toUFix64(flowValue), t.UFix64),
            arg(gasLimit, t.UInt64),
            arg(delaySeconds, t.UFix64),
            arg(priority, t.UInt8),
            arg(executionEffort, t.UInt64),
            arg(transactionData ?? null, t.Optional(t.Void)),
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 9999,
    });

    console.log("Transaction submitted:", txId);
    return txId;
}
