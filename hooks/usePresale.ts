import { useState } from "react";
import { ethers, formatUnits } from "ethers";
import { ADDRESSES } from "../lib/contracts/addresses";
import { PRESALE_ABI, ERC20_ABI } from "../lib/contracts/abis";
import {
  getWeb3Provider,
  WalletNotInstalledError,
  NetworkSwitchError,
  isWalletAvailable,
  promptWalletInstallation
} from "../lib/web3/provider";
import { toast } from "../components/ui/use-toast";
import { UCCInfo, UserUCCInfo } from "../lib/types";

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
            toast({
                title: "Connected",
                description: `Successfully connected to BSC ${ADDRESSES.CHAIN_ID === 97 ? 'Testnet' : 'Mainnet'}`,
                duration: 3000,
            });
        } catch (error: any) {
            console.error("Wallet connection failed:", error);

            if (error instanceof WalletNotInstalledError) {
                toast({
                    title: "Wallet Required",
                    description: error.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else if (error instanceof NetworkSwitchError) {
                toast({
                    title: "Network Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 4000,
                });
            } else if (error.code === -32002) {
                // Handle "Request already pending" error
                toast({
                    title: "Connection Pending",
                    description: "A connection request is already pending in your wallet. Please check your wallet and try again.",
                    variant: "destructive",
                    duration: 4000,
                });
            } else {
                toast({
                    title: "Connection Failed",
                    description: `Wallet connection failed: ${error.message || 'Please try again.'}`,
                    variant: "destructive",
                    duration: 3000,
                });
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
            toast({
                title: "Disconnected",
                description: "Wallet disconnected successfully.",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
            toast({
                title: "Error",
                description: "Error disconnecting wallet.",
                variant: "destructive",
                duration: 3000,
            });
        }
    }

    function getReferralId(): number {
        const urlParams = new URLSearchParams(window.location.search);
        const refParam = urlParams.get('ref');
        const ref = parseInt(refParam || '0', 10);
        if (isNaN(ref)) {
            console.error('Invalid referral ID:', refParam);
            toast({
                title: "Invalid Referral",
                description: "Invalid referral ID",
                variant: "destructive",
                duration: 3000,
            });
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
            toast({
                title: "Success",
                description: `Successfully purchased tokens with ${amount} USDT!`,
                duration: 3000,
            });
            setStatus(PurchaseStatus.IDLE);
        } catch (error: any) {
            console.error('Error during USDT purchase:', error);
            setStatus(PurchaseStatus.ERROR);

            if (error instanceof WalletNotInstalledError) {
                toast({
                    title: "Wallet Required",
                    description: error.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else if (error instanceof NetworkSwitchError) {
                toast({
                    title: "Network Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 4000,
                });
            } else {
                toast({
                    title: "Purchase Failed",
                    description: error.reason || error.message || 'An unexpected error occurred.',
                    variant: "destructive",
                    duration: 3000,
                });
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
            toast({
                title: "Success",
                description: `Successfully purchased tokens with ${amount} BNB!`,
                duration: 3000,
            });
            setStatus(PurchaseStatus.IDLE);
        } catch (error: any) {
            console.error('Error during BNB purchase:', error);
            setStatus(PurchaseStatus.ERROR);

            if (error instanceof WalletNotInstalledError) {
                toast({
                    title: "Wallet Required",
                    description: error.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else if (error instanceof NetworkSwitchError) {
                toast({
                    title: "Network Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 4000,
                });
            } else {
                toast({
                    title: "Purchase Failed",
                    description: error.reason || error.message || 'An unexpected error occurred.',
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };

    async function getUCCInfo(ps: ethers.Contract): Promise<UCCInfo> {
        try {
            const totalInvestmentsUSDT = await ps.totalInvestmentsUSDT();
            const totalInvestmentsBNB = await ps.totalInvestmentsBNB();
            const totalUsers = await ps.totalUsers();
            const priceUSDT = await ps.price();
            const priceBNB = await ps.priceBNB();
            const totalTokensToBEDistributed =
                await ps.totalTokensToBEDistributed();

            setTotalToken(b2i(totalTokensToBEDistributed));

            return {
                totalInvestmentsUSDT: b2i(totalInvestmentsUSDT),
                totalInvestmentsBNB: b2f(totalInvestmentsBNB),
                totalUsers,
                priceUSDT: b2f(priceUSDT),
                priceBNB: b2f(priceBNB),
                totalTokensToBEDistributed: b2i(totalTokensToBEDistributed),
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
            const userId = await ps.id(ua);
            const usersInfo = await ps.usersInfo(userId);
            let activityLength = 0;
            let recentActivities: any[] = [];

            if (parseInt(userId.toString()) !== 0) {
                activityLength = await ps.getUserActivitiesLength(userId);
                recentActivities = await ps.getRecentActivities(userId, cpage);
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