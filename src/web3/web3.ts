import MetaMaskOnboarding from "@metamask/onboarding";
import {Web3Provider} from "@ethersproject/providers"


export const NETWORKDETAILS = {
    name: "Flow EVM Testnet",
    url: "https://testnet.evm.nodes.onflow.org",
    chainId: "0x221",//"545",
    currency: "FLOW",
    blockExplorer: "https://evm-testnet.flowscan.io/"

}


export function web3Injected(): boolean {
    //@ts-ignore
    if (window.ethereum !== undefined) {
        return true;
    } else {
        return false;
    }
}

export async function getChainId(provider: any): Promise<number> {
    const { chainId } = await provider.getNetwork();
    return chainId
}

function getWeb3Provider() {

    //@ts-ignore
    const provider = new Web3Provider(window.ethereum)
    //@ts-ignore
    window.ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
    });
    return provider;
}


export function doOnBoarding() {
    const onboarding = new MetaMaskOnboarding();
    onboarding.startOnboarding();
}

//This is the main entrypoint then
export async function handleNetworkSelect(handleError: any) {
    const onboardSuccess = await onboardOrSwitchNetwork(handleError);
    if (!onboardSuccess) {
        return false;
    } else {
        const provider = getWeb3Provider();

        return provider;
    }
}

export async function onboardOrSwitchNetwork(handleError: any) {
    if (!web3Injected()) {
        handleError("You need to install metamask!");
        await doOnBoarding();
        return false;
    }
    return switchNetwork();
}


export async function requestAccounts() {
    //@ts-ignore
    await window.ethereum.send("eth_requestAccounts", []); // prompts user to connect

}

async function ethereumRequestAddChain(
    hexchainId: string,
    chainName: string,
    name: string,
    symbol: string,
    decimals: number,
    rpcUrls: string[],
    blockExplorerUrls: string[]) {
    //@ts-ignore
    await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: hexchainId,
                chainName,
                nativeCurrency: {
                    name,
                    symbol,
                    decimals,
                },
                rpcUrls,
                blockExplorerUrls,
            },
        ],
    });
}

export async function switchNetwork() {
    const name = NETWORKDETAILS.name
    if (!name) {
        // If I can't find the name, the rest will fail too
        return false;
    }
    const curr = NETWORKDETAILS.currency
    const rpcs = [NETWORKDETAILS.url];
    const blockExplorerUrls = [NETWORKDETAILS.blockExplorer];
    const chainId = NETWORKDETAILS.chainId
    const switched = await switch_to_Chain(chainId);

    if (!switched) {
        // If I can't switch to it, I try to add it!
        await ethereumRequestAddChain(chainId, name, curr, curr, 18, rpcs, blockExplorerUrls);
    }

    return true;
}


async function switch_to_Chain(chainId: string) {
    try {
        let errorOccured = false;
        //@ts-ignore
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
        }).catch((err: any) => {
            if (err.message !== "User rejected the request.")
                errorOccured = true;
        })
        if (errorOccured) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        return false;
    }
}
