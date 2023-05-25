import { getContract } from "@wagmi/core";
import { useContract, useSigner } from "wagmi";
import presaleAbi from "../abis/presale.json";
import { getProvider } from "@wagmi/core";

export const PresaleContract = () => {
  const provider = getProvider();
  const { data: signer, isError, isLoading } = useSigner();

  const contract = useContract({
    address: "0xf49BE35B6a3032698E4dDD8A5D4Fc518DbCD8a50",
    abi: presaleAbi,
    signerOrProvider: signer
  });

  return contract;
};






