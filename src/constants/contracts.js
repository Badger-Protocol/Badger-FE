import { ethers } from "ethers";
import Abi from "./abi.json";
import fungibleAbi from "./fungibleAbi.json";

export const getFactoryContract = (providerOrSigner) =>
    new ethers.Contract(
        process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
        Abi,
        providerOrSigner
    );

    export const getFungibleContract = (providerOrSigner, tokenAddress) =>
    new ethers.Contract(
        tokenAddress,
        fungibleAbi,
        providerOrSigner
    );