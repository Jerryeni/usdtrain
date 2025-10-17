import { useState } from "react";
import { ethers, formatUnits } from "ethers";
import { ADDRESSES } from "../lib/contracts/addresses";
import {
  getWeb3Provider,
  WalletNotInstalledError,
  NetworkSwitchError,
  isWalletAvailable,
  promptWalletInstallation
} from "../lib/web3/provider";
import { PRESALE_ABI, ERC20_ABI } from "../lib/contracts/abis";
import { UCCInfo, UserUCCInfo } from "../lib/types";
// import { PRESALE_ABI, ERC20_ABI } from "../lib/contracts/abis"; // REMOVE: Not needed, use inline ABI or import only where used

export enum PurchaseStatus {
    IDLE = "IDLE",
    APPROVING = "APPROVING",
    APPROVED = "APPROVED",
    PURCHASING = "PURCHASING",
    CONFIRMED = "CONFIRMED",
    ERROR = "ERROR",
}

export function usePresale() {
    const [status, setStatus] = useState<PurchaseStatus>(PurchaseStatus.IDLE);
    const [userAddress, setUserAddress] = useState<string>("");
    const [curPage, setCurPage] = useState<number>(1);
    const [totalTokens, setTotalToken] = useState<number>(0);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [uccInfo, setUCCInfo] = useState<UCCInfo>({
        totalInvestmentsUSDT: 0,
        totalInvestmentsBNB: 0,
        totalUsers: 0,
        priceUSDT: 0,
        priceBNB: 0,
        totalTokensToBEDistributed: 0,
    });

    const [userUCCInfo, setUserUCCInfo] = useState<UserUCCInfo>({
        userId: 0,
        usersInfo: null,
        recentActivities: [],
        activityLength: 0,
    });

    async function initWallet() {
        // Prevent multiple simultaneous connection requests
        if (isConnecting) {
            console.log("Connection already in progress, skipping...");
            return;
        }

        setIsConnecting(true);
        try {
            // Check if wallet is available first
            if (!isWalletAvailable()) {
                promptWalletInstallation();
                throw new WalletNotInstalledError();
            }

            console.log("Initializing wallet connection...");
            const _provider = await getWeb3Provider();
            const _signer = await _provider.getSigner();
            // Request accounts if not already connected
            if (window.ethereum && window.ethereum.request) {
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                } catch (err: any) {
                    if (err.code === -32002) {
                        console.error("Connection Pending: A connection request is already pending in your wallet. Please check your wallet and try again.");
                        return;
                    }
                    throw err;
                }
            }
            const _userAddress = await _signer.getAddress();

            if (!_userAddress) {
                throw new Error("No wallet connected.");
            }

            setUserAddress(_userAddress);

            // Presale Contract
            const ps = new ethers.Contract(
                ADDRESSES.PRESALE,
                PRESALE_ABI,
                _signer,
            );

            console.log("Fetching contract data...");
            const ucci = await getUCCInfo(ps);
            const useri = await getUserInfo(ps, _userAddress, curPage);

            setUCCInfo(ucci);
            setUserUCCInfo(useri);

            console.log("Wallet connected successfully:", _userAddress);
            console.log(`Successfully connected to BSC ${ADDRESSES.CHAIN_ID === 97 ? 'Testnet' : 'Mainnet'}`);
        } catch (error: any) {
            console.error("Wallet connection failed:", error);

            if (error instanceof WalletNotInstalledError) {
                console.error("Wallet Required:", error.message);
            } else if (error instanceof NetworkSwitchError) {
                console.error("Network Error:", error.message);
            } else if (error.code === -32002) {
                // Handle "Request already pending" error
                console.error("Connection Pending: A connection request is already pending in your wallet. Please check your wallet and try again.");
            } else {
                console.error(`Wallet connection failed: ${error.message || 'Please try again.'}`);
            }
        } finally {
            setIsConnecting(false);
        }
    }

    async function disconnectWallet() {
        try {
            setUserAddress("");
            setUserUCCInfo({
                userId: 0,
                usersInfo: null,
                recentActivities: [],
                activityLength: 0,
            });
            setUCCInfo({
                totalInvestmentsUSDT: 0,
                totalInvestmentsBNB: 0,
                totalUsers: 0,
                priceUSDT: 0,
                priceBNB: 0,
                totalTokensToBEDistributed: 0,
            });
            setTotalToken(0);
            setCurPage(1);

            console.log("Wallet disconnected successfully.");
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    }

    function getReferralId(): number {
        const urlParams = new URLSearchParams(window.location.search);
        const refParam = urlParams.get('ref');
        const ref = parseInt(refParam || '0', 10);
        if (isNaN(ref)) {
            console.error('Invalid referral ID:', refParam);
            return 0;
        }
        return ref;
    }

    const buyWithUSDT = async (amount: string, ref?: number) => {
        try {
            // Validate amount
            if (!amount || parseFloat(amount) <= 0) {
                throw new Error("Please enter a valid amount");
            }

            const _provider = await getWeb3Provider();
            const _signer = await _provider.getSigner();
            const _userAddress = await _signer.getAddress();
            const ps = new ethers.Contract(
                ADDRESSES.PRESALE,
                PRESALE_ABI,
                _signer,
            );
            const ua = new ethers.Contract(ADDRESSES.USDT, ERC20_ABI, _signer);

            const referralId = ref !== undefined ? ref : getReferralId();

            setStatus(PurchaseStatus.APPROVING);
            const parsedAmount = ethers.parseUnits(amount, 18);

            console.log('Approving USDT...', parsedAmount.toString());
            const approveTx = await ua.approve(ADDRESSES.PRESALE, parsedAmount);
            await approveTx.wait();
            setStatus(PurchaseStatus.APPROVED);

            setStatus(PurchaseStatus.PURCHASING);
            console.log('Purchasing tokens...', { user: _userAddress, ref: referralId, amount: parsedAmount.toString() });
            const buyTx = await ps.buy(_userAddress, referralId, parsedAmount);
            await buyTx.wait();

            const ucci = await getUCCInfo(ps);
            const useri = await getUserInfo(ps, _userAddress, 1);
            setUCCInfo(ucci);
            setUserUCCInfo(useri);

            setStatus(PurchaseStatus.CONFIRMED);
            console.log(`Successfully purchased tokens with ${amount} USDT!`);
            setStatus(PurchaseStatus.IDLE);
        } catch (error: any) {
            console.error('Error during USDT purchase:', error);
            setStatus(PurchaseStatus.ERROR);

            if (error instanceof WalletNotInstalledError) {
                console.error("Wallet Required:", error.message);
            } else if (error instanceof NetworkSwitchError) {
                console.error("Network Error:", error.message);
            } else {
                console.error("Purchase Failed:", error.reason || error.message || 'An unexpected error occurred.');
            }
        }
    };

    const buyWithBNB = async (amount: string, ref?: number) => {
        try {
            // Validate amount
            if (!amount || parseFloat(amount) <= 0) {
                throw new Error("Please enter a valid amount");
            }

            const _provider = await getWeb3Provider();
            const _signer = await _provider.getSigner();
            const _userAddress = await _signer.getAddress();
            const ps = new ethers.Contract(
                ADDRESSES.PRESALE,
                PRESALE_ABI,
                _signer,
            );

            const referralId = ref !== undefined ? ref : getReferralId();

            setStatus(PurchaseStatus.PURCHASING);
            const parsedAmount = ethers.parseEther(amount);

            console.log('Purchasing with BNB...', {
                user: _userAddress,
                ref: referralId,
                amount: parsedAmount.toString(),
                value: parsedAmount.toString()
            });

            const buyTx = await ps.buy(_userAddress, referralId, 0, {
                value: parsedAmount,
            });
            await buyTx.wait();

            const ucci = await getUCCInfo(ps);
            const useri = await getUserInfo(ps, _userAddress, 1);
            setUCCInfo(ucci);
            setUserUCCInfo(useri);

            setStatus(PurchaseStatus.CONFIRMED);
            console.log(`Successfully purchased tokens with ${amount} BNB!`);
            setStatus(PurchaseStatus.IDLE);
        } catch (error: any) {
            console.error('Error during BNB purchase:', error);
            setStatus(PurchaseStatus.ERROR);

            if (error instanceof WalletNotInstalledError) {
                console.error("Wallet Required:", error.message);
            } else if (error instanceof NetworkSwitchError) {
                console.error("Network Error:", error.message);
            } else {
                console.error("Purchase Failed:", error.reason || error.message || 'An unexpected error occurred.');
            }
        }
    };

    async function getUCCInfo(ps: ethers.Contract): Promise<UCCInfo> {
        try {
            // Use getContractStats for main stats
            const stats = await ps.getContractStats();
            // stats: [_totalUsers, _totalActivatedUsers, _globalPoolBalance, _totalDistributed, _eligibleUsersCount]
            // You may need to adjust the mapping below based on actual contract return order
            const totalUsers = Number(stats[0]);
            // Fallbacks for price and tokens
            let priceUSDT = 0, priceBNB = 0, totalTokensToBEDistributed = 0;
            try { priceUSDT = Number(await ps.price()); } catch (e) { console.warn("price() not found", e); }
            try { priceBNB = Number(await ps.priceBNB()); } catch (e) { console.warn("priceBNB() not found", e); }
            try { totalTokensToBEDistributed = Number(await ps.totalTokensToBEDistributed()); } catch (e) { console.warn("totalTokensToBEDistributed() not found", e); }

            setTotalToken(totalTokensToBEDistributed);

            // If you want to display pool/earnings, extract from stats[2..4] as needed

            return {
                totalInvestmentsUSDT: 0, // Not available in ABI, set to 0 or remove from UI
                totalInvestmentsBNB: 0,  // Not available in ABI, set to 0 or remove from UI
                totalUsers,
                priceUSDT,
                priceBNB,
                totalTokensToBEDistributed,
            };
        } catch (error: any) {
            console.error('Error fetching UCC info:', error);
            return {
                totalInvestmentsUSDT: 0,
                totalInvestmentsBNB: 0,
                totalUsers: 0,
                priceUSDT: 0,
                priceBNB: 0,
                totalTokensToBEDistributed: 0,
            };
        }
    }

    async function getUserInfo(
        ps: ethers.Contract,
        ua: string,
        cpage: number,
    ): Promise<UserUCCInfo> {
        try {
            // Use getUserIdByAddress and getUserInfo(address)
            const userId = await ps.getUserIdByAddress(ua);
            const usersInfo = await ps.getUserInfo(ua);
            let activityLength = 0;
            let recentActivities: any[] = [];

            // If you have activity methods, use them, else skip
            try {
                if (parseInt(userId.toString()) !== 0 && ps.getUserActivitiesLength && ps.getRecentActivities) {
                    activityLength = await ps.getUserActivitiesLength(userId);
                    recentActivities = await ps.getRecentActivities(userId, cpage);
                }
            } catch (e) {
                console.warn("Activity methods not found in contract", e);
            }

            return {
                userId,
                usersInfo: userId == 0 ? null : usersInfo,
                recentActivities,
                activityLength: parseInt(activityLength.toString()),
            };
        } catch (error: any) {
            console.error('Error fetching user info:', error);
            return {
                userId: 0,
                usersInfo: null,
                recentActivities: [],
                activityLength: 0,
            };
        }
    }

    const resetStatus = () => setStatus(PurchaseStatus.IDLE);

    return {
        status,
        uccInfo,
        userUCCInfo,
        userAddress,
        totalTokens,
        curPage,
        setCurPage,
        buyWithUSDT,
        buyWithBNB,
        resetStatus,
        initWallet,
        disconnectWallet,
        isConnecting,
    };
}

export function b2i(amt: any): number {
    return parseInt(formatUnits(amt, 18));
}

export function b2f(amt: any): number {
    return parseFloat(formatUnits(amt, 18));
}