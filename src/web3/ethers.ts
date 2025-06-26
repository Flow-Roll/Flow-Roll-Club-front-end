//Flow Roll Club is deployed on Flow EVM testnet

//It is accessed using ethers.js using the json rpc provider for ethereum
import { JsonRpcProvider, Contract } from "ethers";

const NETWORKDETAILS = {
    name: "Flow EVM Testnet",
    url: "https://testnet.evm.nodes.onflow.org"
}

export function getJsonRpcProvider(): any {
    return new JsonRpcProvider(NETWORKDETAILS.url);
}

export async function fetchAbi(at: string) {
    const res = await fetch(at);
    return res.json();
}


export async function getContract(provider: any, at: string, abiPath: string): Promise<any> {
    const artifact = await fetchAbi(abiPath);
    const signer = provider.getSigner();
    return new Contract(at, artifact.abi, signer);
}


//CALL METHODS FOR THE NFT Sale contract
/**
 * 
 * @param contract The NFTSale contract initialized with getContract
 * @param coupon  The string coupon
 * @returns string, number,number,number
 * couponComissionAddresses[coupon] : string
 * couponPercentageOff[coupon], number
 * couponComission[coupon], number
 * couponUsesLeft[coupon] number
 */
async function getCoupon(contract: any, coupon: string) {
    //Returns   

    return await contract.getCoupon(coupon);
}
/**
 * 
 * @param contract The NFTSale contract
 * @param myaddress The address that used the coupon, possibly mine
 * @param coupon The coupon string
 * @returns boolean
 */
async function usedCouponAlready(contract: any, myaddress: string, coupon: string) {
    return await contract.usedCouponAlready(myaddress, coupon);
}

/**
 * This function returns the exchange rate of FLOW/USD
 * @param contract The NFTSale contract
 * @returns 
 */
async function getUSDPriceInFlow(contract: any) {
    return await contract.getUSDPriceInFlow();
}

/**
 * Fetches the expected amount of flow needed to mint an NFT
 * @param contract The NFTSale contract
 * @returns The expected amount of Flow needed to mint an NFT
 */
async function getExpectedPriceInFlow(contract: any) {
    return await contract.getExpectedPriceInFlow();
}

/**
 * Fetches the coupon reduced price
 * @param contract The NFTSale Contract
 * @param coupon - The string coupon
 * @param flowPrice - The price returned by the getExpectedPriceInFlow function
 * @returns BigInt , the reduced price to pay in Flow to mint
 */
async function getReducedPrice(contract: any, coupon: string, flowPrice: BigInt) {
    return await contract.getReducedPrice(coupon, flowPrice)
}
/**
 * Shows the commission earned with the coupon at the price
 * @param contract The NFTSale contract
 * @param newPrice The price from getReducedPrice
 * @param coupon The coupon string
 * @returns 
 */

async function getCommission(contract: any, newPrice: BigInt, coupon: string) {
    return await contract.getComission(newPrice, coupon);
}

// MUTATING METHODS FOR NFTSale CONTRACT

/**
 * The function that mints the NFTs and creates the dice games
 * @param contract The NFTSale contract
 * @param coupon  The coupon to apply
 * @param to  The address that will own the NFT and the dice ame
 * @param ERC20Address The address of the ERC20 token used, zero address for Flow
 * @param winnerPrizeShare The percentage of the prize pool that can be won
 * @param diceRollCost The cost of a dice roll, a bet, bigint
 * @param houseEdge The house edge is a percentage, number
 * @param revealCompensation The reveal compensation is a bigint, the amount of flow transferred for rolling the dice
 * @param betParams The parameters , min, max, betType
 * @returns 
 */
async function buyNFT(
    contract: any,
    coupon: string,
    to: string,
    ERC20Address: string,
    winnerPrizeShare: number,
    diceRollCost: BigInt,
    houseEdge: number,
    revealCompensation: BigInt,
    betParams: Array<number>[3]
) {
    return await contract.buyNFT(
        coupon,
        to,
        ERC20Address,
        winnerPrizeShare,
        diceRollCost,
        houseEdge,
        revealCompensation,
        betParams
    )
}

//THE VIEW FUNCTIONS FOR THE FLOW ROLL NFT CONTRACT

/**
 * 
 * @param contract The FlowRollNFT contract
 * @returns number, the MAXMINt variable
 */
async function MAXMINT(contract: any) {
    return await contract.MAXMINT();
}

/**
 * 
 * @param contract The FlowRollNFT contract
 * @returns number, the currently minted NFTs count
 */
async function count(contract: any) {
    return await contract.count();
}

/**
 * Returns the game contract's addresses using the NFT's index
 * @param contract The FlowRollNFT contract
 * @param index The index of the NFT
 * @returns the smart contract address of the game
 */
async function flowRollContractAddresses(contract: any, index: number): Promise<string> {
    return await contract.flowRollContractAddresses(index);
}
/**
 * Returns if the game parameters exist already, useful for checking on the front end, because the contract will fail
 * @param contract  The FlowRollNFT contract
 * @param hash The hash of the paramters
 * @returns boolean, does it exist already
 */
async function parametersExist(contract: any, hash: string): Promise<boolean> {
    return await contract.parametersExist(hash);
}
/**
 * 
 * @param contract The FlowRollNFT contract
 * @returns a number, the percentage of the protocol fee taken from the house edge
 */
async function protocolFee(contract: any): Promise<number> {
    return await contract.protocolFee();
}
/**
 * 
 * @param contract The FlowRollNFT contract
 * @param tokenId the Id of the token
 * @returns the token URI
 */
async function tokenURI(contract: any, tokenId: string): Promise<string> {
    return await contract.tokenURI(tokenId);
}

/**
 * Hashes the parameters to check for duplicates.
 * @param contract The FlowRollNFT contract
 * @param winnerPrizeShare The percentage of the prize pool pay out
 * @param diceRollCost The cost of a bet
 * @param houseEdge The percentage of the house win
 * @param revealCompensation The cost of the dice rolling
 * @param min The minimum number
 * @param max The maximum number
 * @param betType The type of the bet 0 or numbers bigger than 1
 * @returns 
 */
async function hashRollParameters(
    contract: any,
    winnerPrizeShare: number,
    diceRollCost: BigInt,
    houseEdge: number,
    revealCompensation: BigInt,
    min: number,
    max: number,
    betType: number
) {
    return await contract.hashRollParameters(
        winnerPrizeShare,
        diceRollCost,
        houseEdge,
        revealCompensation,
        min,
        max,
        betType
    );
}

/**
 * Standard NFT balanceOf function
 * @param contract The FlowRollNFT contract
 * @param owner -The owner of the NFT
 * @returns a BigInt, the number of the NFTs the owner holds
 */

async function balanceOf(contract: any, owner: string) {
    return await contract.balanceOf(owner)
}

/**
 * Standard ownerof NFT function
 * @param contract The FlowRollNFT contract
 * @param tokenId The id of the token
 * @returns an address
 */
async function ownerOf(contract: any, tokenId: string) {
    return await contract.ownerOf(tokenId);
}

//FlowRollNFT MUTATING FUNCTIONS

/**
 * The standard NFT transfer method
 * @param contract The FlowRollNFT contract
 * @param from Transfer From address
 * @param to Transfer To Address
 * @param tokenId The tokenId to transfer
 * @returns void
 */

async function safeTransferFrom(contract: any, from: string, to: string, tokenId: BigInt) {
    return await contract.safeTransferFrom(from, to, tokenId)
}

//Flow Roll GAME VIEW FUNCTIONS

/**
 * Returns the Prize vault for this contract
 * @param contract The FlowRoll game contract 
 * @returns BigInt
 */
async function prizeVault(contract: any) {
    return await contract.prizeVault();
}

/**
 * Returns the address of the ERC20 used, returns zero address for FLOW
 * @param contract The Flow Roll game contract
 * @returns string
 */

async function ERC20Address(contract: any) {
    return await contract.ERC20Address();
}

/**
 * 
 * @param contract The Flow Roll Game contract
 * @returns The contract parameters (number,bigint,number, bigint,number,number,number)
 * returns winnerPrizeShare,diceRollCost,houseEdge,revealCompensation,min,max, betType
 */

async function getContractParameters(contract: any) {
    return await contract.getContractParameters();
}

/**
 * Returns the last bet's index
 * @param contract The Flow Roll Game contract
 * @returns BigInt, the lastBet's index
 */

async function lastBet(contract: any) {
    return await contract.lastBet();
}

/**
 * 
 * @param contract The FLow Roll Game Contract
 * @returns BigInt, the lastClosedBet's index
 */

async function lastClosedBet(contract: any) {
    return await contract.lastClosedBet();
}

export type DiceBets = {
    requestId: bigint //The requestId for the randomness
    createdAtBlock: bigint
    player: string //The address that is betting
    bet: number; //The number to bet on
    closed: boolean
    won: boolean
    numberRolled: number
    payout: bigint
}

/**
 * Returns the parameters of the bet for display
 * @param contract The Flow Roll Game Contract
 * @param index The index of the bet, either from lastBet or lastClosedBet
 * @returns DiceBets in an array
 */

async function bets(contract: any, index: BigInt) {
    return await contract.bets(index);
}

//MUTATING FUNCTION FOR DICE BET GAME

/**
 * Fund the prize pool with Flow to incentivize players to try to win
 * @param contract The Flow Roll Game Contract
 * @param amount The amount to deposit
 * @returns void
 */
async function fundPrizePoolFlow(contract: any, amount: BigInt) {
    return await contract.fundPrizePoolFlow(amount, { value: amount })
}

/**
 * Fund the prize pool with ERC20 tokens to incentivize players to try to win
 * @param contract The Flow Roll Game COntract
 * @param amount The amount to deposit
 * @returns void
 */

async function fundPrizePoolERC20(contract: any, amount: BigInt) {
    return await contract.fundPrizePoolERC20(amount);
}

/**
 * Bet Flow on a number
 * @param contract The Flow Roll Game Contract
 * @param bet The number to place a bet on
 * @returns void
 */

async function betFlow(contract: any, bet: number) {
    return await contract.betFlow(bet);
}

/**
 * Bet ERC20 on a number
 * @param contract The Flow ROll Game contract
 * @param betAmount The amount to bet, must equal diceRollCost
 * @param bet The number to bet on
 * @returns void
 */

async function betERC20(contract: any, betAmount: BigInt, bet: number) {
    return await contract.betERC20(betAmount, bet);
}

/**
 * Roll the dice and evaluate a bet
 * @param contract The Flow Roll Game Contract
 * @returns void
 */
async function revealDiceRoll(contract: any) {
    return await contract.revealDiceRoll();
}

export const NFTSaleContract = {
    view: {
        getCoupon,
        usedCouponAlready,
        getUSDPriceInFlow,
        getExpectedPriceInFlow,
        getReducedPrice,
        getCommission
    },
    mutate: {
        buyNFT
    }
}

export const FLOWROLLNFTContract = {
    view: {
        MAXMINT,
        count,
        flowRollContractAddresses,
        parametersExist,
        protocolFee,
        tokenURI,
        hashRollParameters,
        balanceOf,
        ownerOf
    },
    mutate: {
        safeTransferFrom
    }
}

export const FLOWROLLGameContract = {
    view: {
        prizeVault,
        ERC20Address,
        getContractParameters,
        lastBet,
        lastClosedBet,
        bets
    },
    mutate: {
        fundPrizePoolFlow,
        fundPrizePoolERC20,
        betFlow,
        betERC20,
        revealDiceRoll
    }
}