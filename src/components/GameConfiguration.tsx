import { useEffect, useRef, useState } from 'react';
import { Dice1, Coins, Trophy, Settings, Zap, Badge, ArrowDownCircle, ArrowUpCircle, Shuffle, Divide } from 'lucide-react';
import { ERC20Contract, FLOWROLLNFTContract, getContractOnlyView, getJsonRpcProvider, NFTSale_v2Contract } from '../web3/ethers';
import { CONTRACTADDRESSES } from '../web3/contracts';
import { formatEther, parseEther, ZeroAddress } from 'ethers';
import DiceGameSummary from './DiceGameSummary';
import DisplayOddsAndPrizePool from './DisplayOddsAndPrizePool';

import { getAddress } from 'viem'
import { authenticateFCL, buyNFT } from '../web3/fcl';
import { UnauthenticateButton } from './UnauthenticateButton';

export default function AnimatedBettingForm(props: { openSnackbar: CallableFunction }) {
    const [mintCostFlow, setMintCostFlow] = useState("");
    const [nftCount, setNFTCount] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch data runs    ")
            const provider = getJsonRpcProvider();
            const nftSaleContract = await getContractOnlyView(provider, CONTRACTADDRESSES.NFTSaleV2, "NFTSale_v2.json")
            const expectedPrice = await NFTSale_v2Contract.view.getFlowCost(nftSaleContract);
            setMintCostFlow(formatEther(expectedPrice))
            const nftContract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "FlowRollNFT.json")
            const count = await FLOWROLLNFTContract.view.count(nftContract)
            setNFTCount(count);

        }
        fetchData()
    }, [])

    const nameRef = useRef<HTMLInputElement | null>(null)
    const tokenAddressRef = useRef<HTMLInputElement | null>(null)
    const couponCodeRef = useRef<HTMLInputElement | null>(null);
    const diceRollCostRef = useRef<HTMLInputElement | null>(null);
    const revealCompensationRef = useRef<HTMLInputElement | null>(null);
    const betMinRef = useRef<HTMLInputElement | null>(null)
    const betMaxRef = useRef<HTMLInputElement | null>(null)
    const dividerRef = useRef<HTMLInputElement | null>(null)

    type FormField =
        | "name"
        | "couponCode"
        | "tokenAddress"
        | "winnerPrizeShare"
        | "diceRollCost"
        | "houseEdge"
        // | "revealCompensation"
        | "betMin"
        | "betMax"
        | "betType"
        | "divider";

    const [formData, setFormData] = useState({
        name: "",
        couponCode: '',
        tokenAddress: '',
        winnerPrizeShare: 50,
        diceRollCost: '',
        houseEdge: 2,
        // revealCompensati on: '',
        betMin: '',
        betMax: '',
        betType: 'userguess',
        divider: 2
    });

    const [tokenAddressName, setTokenAddressName] = useState("FLOW")

    const errorDisplayDefault = {
        nameError: "",
        couponError: "",
        tokenAddressError: "",
        winnerPrizeShareError: "",
        diceRollCostError: "",
        houseEdgeError: "",
        // revealCompensationError: "",
        betMinError: "",
        betMaxError: "",
        dividerError: ""
    }

    const [errorDisplay, setErrorDisplay] = useState(errorDisplayDefault)

    type ErrorField =
        "nameError" |
        "couponError" |
        "tokenAddressError" |
        "winnerPrizeShareError" |
        "diceRollCostError" |
        "houseEdgeError" |
        // "revealCompensationError" |
        "betMinError" |
        "betMaxError" |
        "dividerError"

    const [focusedField, setFocusedField] = useState<any>(null);


    type CouponDetails = {
        couponPercentage: string,
        commissionPaymentAddress: string,
        paymentWithCoupon: string,
        couponUsesLeft: number,
        isSet: boolean
    }

    const [couponDetails, setCouponDetails] = useState<CouponDetails>(
        {
            couponPercentage: "0",
            commissionPaymentAddress: "",
            paymentWithCoupon: "",
            couponUsesLeft: 0,
            isSet: false
        });


    function getBetParams(formData: any) {

        const betType = formData.betType === "userguess" ? 0 : formData.divider;

        const min = parseInt(formData.betMin);
        const max = parseInt(formData.betMax);

        const betParams = Array<number>(3)
        betParams[0] = min;
        betParams[1] = max;
        betParams[2] = betType;

        return betParams;
    }


    const handleInputChange = async (field: FormField, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        const provider = getJsonRpcProvider();

        switch (field) {
            case "name":
                //Check if the name exists already
                break;
            case "couponCode":
                if (value != "") {
                    const contract = await getContractOnlyView(provider, CONTRACTADDRESSES.NFTSaleV2, "NFTSale_v2.json")
                    const coupon = await NFTSale_v2Contract.view.getCoupon(contract, value as string);
                    if (coupon[0] === ZeroAddress) {

                        setCouponDetails({
                            couponPercentage: "0",
                            commissionPaymentAddress: "",
                            paymentWithCoupon: "",
                            couponUsesLeft: 0,
                            isSet: false
                        })
                    } else {

                        const couponComissionAddresses = coupon[0];
                        const couponPercentageOff = coupon[1];
                        // const couponCommission = coupon[2];
                        const couponUsesLeft = coupon[3];

                        //Check if used already!

                        // const usedAlready = await NFTSaleContract.view.usedCouponAlready(contract, value as string);

                        const flowPrice = parseEther(mintCostFlow);

                        const paymentWithCoupon = await NFTSale_v2Contract.view.getReducedPrice(contract, value as string, flowPrice);


                        setCouponDetails(
                            {
                                couponPercentage: couponPercentageOff.toString(),
                                commissionPaymentAddress: couponComissionAddresses,
                                paymentWithCoupon: formatEther(paymentWithCoupon),
                                couponUsesLeft,
                                isSet: true
                            }
                        )

                    }
                }
                break;
            case "tokenAddress":
                if (value !== "") {
                    const contract = await getContractOnlyView(provider, value as any, "ERC20.json")
                    const erc20Name = await ERC20Contract.view.name(contract).catch((_err: any) => {
                        props.openSnackbar("Failed to fetch token name")
                        return "";
                    })
                    setTokenAddressName(erc20Name)
                } else {
                    setTokenAddressName("FLOW")
                }
                break;
            case "winnerPrizeShare":
                break;
            case "diceRollCost":
                break;
            case "houseEdge":
                break;
            // case "revealCompensation":
            //     break;
            case "betMin":
                break;
            case "betMax":
                break;
            case "betType":
                break;
            case "divider":
                break;
            default:
                break;
        }
    };

    function scrollIntoView() {
        let scrolledIntoViewAlready = false;

        const validationWrap = (callback: CallableFunction) => {
            console.log(scrolledIntoViewAlready)

            if (scrolledIntoViewAlready) {
                return;
            }

            callback()

            scrolledIntoViewAlready = true;
        }

        const scroll = (ref: any) => {
            if (ref.current) {
                ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }

        return {
            toName: () => validationWrap(function () {
                scroll(nameRef)
            }),
            toTokenAddress: () => validationWrap(function () {
                scroll(tokenAddressRef)
            }),
            toCouponCode: () => validationWrap(function () {
                scroll(couponCodeRef)
            }),
            toDiceRollCost: () => validationWrap(function () {
                scroll(diceRollCostRef)
            }),
            toRevealCompensation: () => validationWrap(function () {
                scroll(revealCompensationRef)
            }),
            toBetMin: () => validationWrap(function () {
                scroll(betMinRef)
            }),
            toBetMax: () => validationWrap(function () {
                scroll(betMaxRef)
            }),
            toDivider: () => validationWrap(function () {
                scroll(dividerRef)
            })
        }
    }

    function isDecimal(value: string) {
        return /^-?\d*\.\d+$/.test(value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        //sets all the error fields back to empty
        setErrorDisplay(errorDisplayDefault)
        let display = errorDisplayDefault;

        let errorOccured = false;
        const scroll = scrollIntoView();

        // Add your form submission logic here
        if (formData.name.length < 3) {
            display = { ...display, nameError: "Name must be at least 3 characters long" }
            errorOccured = true;
            scroll.toName();
        }

        function isValidNumber(value: any) {
            return typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value));
        }
        //Check if the name is a number, it must not be a number

        if (isValidNumber(formData.name)) {
            display = { ...display, nameError: "Name can't be number" }

            errorOccured = true;
            scroll.toName()
        }

        //Check if coupon is not valid but the form is filled out
        if (!couponDetails.isSet && formData.couponCode !== "") {

            display = { ...display, couponError: "Coupon code is invalid" }
            errorOccured = true;
            scroll.toCouponCode();
        }

        if (tokenAddressName === "") {
            display = { ...display, tokenAddressError: "Invalid token address" };
            errorOccured = true;
            scroll.toTokenAddress()
        }

        if (formData.diceRollCost === "" || parseFloat(formData.diceRollCost) <= 0) {
            display = { ...display, diceRollCostError: "Invalid Dice Roll Cost entered" }
            errorOccured = true;
            scroll.toDiceRollCost()
        }

        // if (
        //     formData.revealCompensation === "" ||
        //     parseFloat(formData.revealCompensation) <= 0 ||
        //     parseFloat(formData.revealCompensation) >= parseFloat(formData.diceRollCost)) {
        //     display = { ...display, revealCompensationError: "Invalid roll reward" }
        //     errorOccured = true;
        //     scroll.toRevealCompensation();
        // }


        if (!isValidNumber(formData.betMin)) {
            display = { ...display, betMinError: "Min must be a valid number" }
            errorOccured = true;
            scroll.toBetMin();
        }

        if (isDecimal(formData.betMin)) {
            display = { ...display, betMinError: "Must be integer" }
            errorOccured = true;
            scroll.toBetMin();

        }


        if (!isValidNumber(formData.betMax)) {
            display = { ...display, betMaxError: "Max must be a valid number" }
            errorOccured = true;
            scroll.toBetMax();
        }

        if (isDecimal(formData.betMax)) {
            display = { ...display, betMaxError: "Must be integer" }
            errorOccured = true;
            scroll.toBetMax();

        }


        if (parseFloat(formData.betMin) > parseFloat(formData.betMax)) {
            display = { ...display, betMinError: "The min can't be larger than max", betMaxError: "The max can't be smaller than min" }
            errorOccured = true;
            scroll.toBetMax();
        }

        if (formData.betType !== "userguess" &&
            formData.divider < 2) {
            display = { ...errorDisplay, dividerError: "Divider is minimum 2" };
            errorOccured = true
            scroll.toDivider();
        }

        //Check if wallet is connected, if not prompt to connect

        if (errorOccured) {
            props.openSnackbar("There are errors in the form. Scroll up to see")
            setErrorDisplay(display)
            return;
        }

        const betParams = getBetParams(formData)

        const provider = getJsonRpcProvider()

        if (!provider) {
            props.openSnackbar("unable to connect wallet")
            return;
        }

        const getValue = () => {
            if (couponDetails.isSet) {
                return couponDetails.paymentWithCoupon
            } else {
                return mintCostFlow
            }
        }

        const getTokenAddress = () => {
            if (tokenAddressName === "FLOW") {
                return getAddress(ZeroAddress)
            } else {
                return getAddress(formData.tokenAddress)
            }
        }

        const nftContract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "FlowRollNFT.json")
        const parametersHash = await FLOWROLLNFTContract.view.hashRollParameters(
            nftContract,
            getTokenAddress(),
            formData.winnerPrizeShare,
            parseEther(formData.diceRollCost),
            formData.houseEdge,
            parseEther("0"),
            betParams[0],
            betParams[1],
            betParams[2]
        );
        const existsAlready = await FLOWROLLNFTContract.view.parametersExist(nftContract, parametersHash)

        if (existsAlready) {
            props.openSnackbar("This game configuration exists already");
            return;
        }

        const nameExists = await FLOWROLLNFTContract.view.nameExists(nftContract, formData.name);

        if (nameExists) {
            props.openSnackbar("Name already exists");
            display = { ...display, nameError: "You need to use a different name." }

            errorOccured = true;
            scroll.toName()
            return;
        }

        console.log("name exists", nameExists)

        await authenticateFCL()
        //TODO: fetch the address and run a query to check if the address used the coupon already
        // return
        // if (couponDetails.isSet) {
        //     //TODO: I will need to do an FCL call to check if used the coupon already
        //     const usedCouponAlreadyCheck = await NFTSale_v2Contract.view.usedCouponAlready(contract, address, formData.couponCode);

        //     if (usedCouponAlreadyCheck) {
        //         //The coupon was used already by this address
        //         props.openSnackbar("Your wallet address used the coupon already.")
        //         return;
        //     }
        // }

        try {


            const tx = await buyNFT({
                contractAddress: CONTRACTADDRESSES.NFTSaleV2,
                flowCost: getValue(),
                name: formData.name,
                coupon: formData.couponCode,
                erc20Address: getTokenAddress(),
                winnerPrizeShare: formData.winnerPrizeShare,
                diceRollCost: formData.diceRollCost,
                houseEdge: formData.houseEdge,
                min: betParams[0],
                max: betParams[1],
                betType: betParams[2],
                gasLimit: 2999999
            }).catch((_err: any) => {
                console.log(_err)
                props.openSnackbar("Unable to submit transaction")
                return null;
            });

            if (tx) {
                console.log(tx)
                // window.location.href = "https://flowroll.club/games";
            }


        } catch (err: any) {
            console.log("Error occured: ", err.message)
            props.openSnackbar("Error occured: ", err.message)
        }


    };



    function ShowError({ fieldName }: { fieldName: ErrorField }) {
        return (errorDisplay[fieldName] !== "" ? <div>
            <p className="text-red-600">{errorDisplay[fieldName]}</p>
        </div> : <div></div>)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative">
                <form
                    onSubmit={handleSubmit}
                    className="  backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full transform transition-all duration-500  hover:shadow-3xl"
                >
                    <div className="text-center mb-8">

                        <h2 className="text-3xl font-bold   mb-2">Betting Configuration</h2>
                        <p className=" /70">Set up your game parameters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-1 md:col-span-2  p-4">
                            <label className="flex items-center  text-sm font-medium mb-2">
                                <Badge className="w-4 h-4 mr-2" />
                                Game name
                            </label>
                            <input
                                ref={nameRef}
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg   transition-all duration-300 ${focusedField === 'name'
                                    ? 'border-purple-400 ring-4 ring-purple-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="Enter the name of the game"
                            />
                            <label className="text-sm font-medium">The name of the game is displayed when selecting games</label>
                            <ShowError fieldName="nameError"></ShowError>
                        </div>
                        {/* Coupon Code */}
                        <div className="col-span-1 md:col-span-2  p-4">
                            <label className="flex items-center  text-sm font-medium mb-2">
                                <Zap className="w-4 h-4 mr-2" />
                                Coupon Code
                            </label>
                            <input
                                ref={couponCodeRef}
                                type="text"
                                value={formData.couponCode}
                                onChange={(e) => handleInputChange('couponCode', e.target.value)}
                                onFocus={() => setFocusedField('couponCode')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg   transition-all duration-300 ${focusedField === 'couponCode'
                                    ? 'border-purple-400 ring-4 ring-purple-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="Enter coupon code"
                            />
                            <label className="text-sm font-medium">The coupon allows you to mint a token for cheaper while paying commission to a third party</label>
                            <ShowError fieldName="couponError"></ShowError>
                        </div>

                        {/* ERC-20 Token Address */}
                        <div className="col-span-1 md:col-span-2  p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Coins className="w-4 h-4 mr-2" />
                                ERC-20 Token Address
                            </label>
                            <input
                                ref={tokenAddressRef}
                                type="text"
                                value={formData.tokenAddress}
                                onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
                                onFocus={() => setFocusedField('tokenAddress')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'tokenAddress'
                                    ? 'border-blue-400 ring-4 ring-blue-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="0x..."
                                disabled
                            />
                            <p className="text-sm font-medium">Enter an ERC20 token address or leave empty to use FLOW</p>
                            <ShowError fieldName="tokenAddressError"></ShowError>

                        </div>

                        {/* Winner Prize Share */}
                        <div className="mb-2 p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Trophy className="w-4 h-4 mr-2" />
                                Winner Prize Share: {formData.winnerPrizeShare}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.winnerPrizeShare}
                                onChange={(e) => handleInputChange('winnerPrizeShare', parseInt(e.target.value))}
                                className="shadow mb-2 w-full h-2   rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${formData.winnerPrizeShare}%, rgba(255,255,255,0.2) ${formData.winnerPrizeShare}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                            <p className="text-sm font-medium">The percentage of the whole prize pool paid out to the winner</p>
                            <ShowError fieldName="winnerPrizeShareError"></ShowError>
                        </div>

                        {/* Dice Roll Cost */}
                        <div className="mb-2 p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Dice1 className="w-4 h-4 mr-2" />
                                Fixed Bet Amount
                            </label>
                            <input
                                ref={diceRollCostRef}
                                type="number"
                                value={formData.diceRollCost}
                                onChange={(e) => handleInputChange('diceRollCost', e.target.value)}
                                onFocus={() => setFocusedField('diceRollCost')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'diceRollCost'
                                    ? 'border-green-400 ring-4 ring-green-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="0.01"
                                step="0.01"
                            />
                            <p className='text-sm font-medium'>The Bet amount is how much the players will need to deposit per bet.</p>
                            <ShowError fieldName="diceRollCostError"></ShowError>

                        </div>

                        {/* House Edge */}
                        <div className="mb-2 p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Settings className="w-4 h-4 mr-2" />
                                House Edge: {formData.houseEdge}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={formData.houseEdge}
                                onChange={(e) => handleInputChange('houseEdge', parseFloat(e.target.value))}
                                className="shadow mb-2 w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.houseEdge * 3}%, rgba(255,255,255,0.2) ${formData.houseEdge * 3}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                            <p className='text-sm font-medium'>The percentage the house takes from the win or loss. The NFT owner is transferred this on each roll. There is a protocol fee on the house edge.</p>
                            <ShowError fieldName="houseEdgeError"></ShowError>
                        </div>

                        {/* Bet Min */}
                        <div className="mb-2 p-4">
                            <label className=" /90 text-sm font-medium mb-2 block">
                                <ArrowDownCircle className="w-4 h-4 mr-2" />
                                Bet Min
                            </label>
                            <input
                                ref={betMinRef}
                                type="number"
                                value={formData.betMin}
                                onChange={(e) => handleInputChange('betMin', e.target.value)}
                                onFocus={() => setFocusedField('betMin')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'betMin'
                                    ? 'border-red-400 ring-4 ring-red-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="1"
                                step="1"
                            />
                            <p className="text-sm font-medium">The minimum number to bet on</p>
                            <ShowError fieldName="betMinError"></ShowError>
                        </div>

                        {/* Bet Max */}
                        <div className="mb-2 p-4">
                            <label className=" /90 text-sm font-medium mb-2 block">
                                <ArrowUpCircle className="w-4 h-4 mr-2" />
                                Bet Max
                            </label>
                            <input
                                ref={betMaxRef}
                                type="number"
                                value={formData.betMax}
                                onChange={(e) => handleInputChange('betMax', e.target.value)}
                                onFocus={() => setFocusedField('betMax')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'betMax'
                                    ? 'border-orange-400 ring-4 ring-orange-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="6"
                                step="1"
                            />
                            <p className="text-sm font-medium" >The maximum number to bet on</p>
                            <ShowError fieldName="betMaxError"></ShowError>
                        </div>

                        {/* Bet Type */}
                        <div className="mb-2 p-4">
                            <label className=" text-sm font-medium mb-2 block">
                                <Shuffle className="w-4 h-4 mr-2" />
                                Bet Type
                            </label>
                            <select
                                value={formData.betType}
                                onChange={(e) => handleInputChange('betType', e.target.value)}
                                onFocus={() => setFocusedField('betType')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg   transition-all duration-300 ${focusedField === 'betType'
                                    ? 'border-pink-400 ring-4 ring-pink-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                            >
                                <option value="userguess" className="">Exact Guess</option>
                                <option value="divisible" className="">Divisible By</option>

                            </select>
                            <p className="text-sm font-medium">The player has to guess the number rolled or roll a predetermined winner number which must be divisible by the divider.</p>
                        </div>
                    </div>

                    {formData.betType == "divisible" ?

                        <div className="mb-2 p-4">
                            <label className=" text-sm font-medium mb-2 block">
                                <Divide className="w-4 h-4 mr-2" />
                                Divider
                            </label>
                            <input
                                ref={dividerRef}
                                type="number"
                                value={formData.divider}
                                onChange={(e) => handleInputChange('divider', e.target.value)}
                                onFocus={() => setFocusedField('divider')}
                                onBlur={() => setFocusedField(null)}
                                className={`shadow mb-2 w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'betMax'
                                    ? 'border-orange-400 ring-4 ring-orange-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="6"
                                step="1"
                            />
                            <p className="text-sm font-medium" >The divider specifies what numbers are winners. E.G: Enter 5 to make every number divisible by 5 a winner. You can't use 0 or 1 and it must be between min and max.</p>
                            <ShowError fieldName="dividerError"></ShowError>
                        </div>
                        : <div></div>}

                    <DiceGameSummary
                        name={formData.name}
                        couponCode={formData.couponCode}
                        couponPercentage={couponDetails.couponPercentage}
                        commissionPaymentAddress={couponDetails.commissionPaymentAddress}
                        paymentWithoutCoupon={mintCostFlow}
                        paymentWithCoupon={couponDetails.paymentWithCoupon}
                        paymentCurrency={"Flow"}
                        tokenAddress={formData.tokenAddress}
                        winnerPrizeShare={formData.winnerPrizeShare}
                        diceRollCost={formData.diceRollCost}
                        houseEdge={formData.houseEdge}
                        // compensation={formData.revealCompensation}
                        minimumBet={formData.betMin}
                        maximumBet={formData.betMax}
                        betType={formData.betType}
                        divider={formData.divider}
                        winningNumbersList={calculateWinningNumbersList(formData.betMin, formData.betMax, formData.betType, formData.divider)}
                    ></DiceGameSummary>
                    <DisplayOddsAndPrizePool betMin={formData.betMin} betMax={formData.betMax} betType={formData.betType} divider={formData.divider}></DisplayOddsAndPrizePool>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-8 border cursor-pointer       py-4 px-6 rounded-lg font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
                    >
                        <span className="flex items-center justify-center">
                            <Dice1 className="w-5 h-5 mr-2 animate-spin" />
                            Mint Game {isNaN(parseInt(nftCount)) ? "" : parseInt(nftCount)}
                        </span>
                    </button>
                    <UnauthenticateButton />
                </form>
            </div>

            <style >{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .hide-scrollbar {
          @apply overflow-auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
        }

        .hide-scrollbar::-webkit-scrollbar {
           display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
        </div>
    );
}

export function calculateWinningNumbersList(
    betMin: string,
    betMax: string,
    betType: string,
    divider: number) {
    if (betType !== "divisible") {
        return [" "]
    }

    if (parseInt(betMin) >= parseInt(betMax)) {
        return [" "]
    }

    if (divider > parseInt(betMax)) {
        return [" "]
    }

    let winningNumberList = [];


    for (let i = parseInt(betMin); i <= parseInt(betMax); i++) {

        if (i % divider === 0) {
            winningNumberList.push(i);
        }
    }

    return winningNumberList
}