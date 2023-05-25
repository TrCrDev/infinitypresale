import { z, ZodError } from "zod";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { useAccount, useDisconnect } from "wagmi";
import { PresaleContract } from "../custom-hooks/contracts";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { getProof } from "./whitelistchecker.mjs";

export function fromTokenAmount(
  amount: BigNumber | number | string,
  decimals: number
): BigNumber {
  return new BigNumber(amount).times(
    new BigNumber(10).exponentiatedBy(decimals)
  );
}

const buySchema = z.object({
  amount: z.string().refine(
    val => {
      const amtBN = new BigNumber(val);
      return amtBN.isGreaterThan(0);
    },
    {
      message: "Please enter a valid ETH amount!"
    }
  )
});


const BuyForm = () => {
  const { address } = useAccount();
  const [values, setValues] = useState({
    amount: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<{
    amount: string[] | null;
  }>({ amount: null });

  const contract = PresaleContract();
  console.log("contract");



  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      buySchema.parse({
        amount: values.amount.toString()
      });
      const proof = getProof(address);

      const isEnded = await contract?.isPublicSaleEnded();
      if(isEnded) {
        const txn = await contract?.DepositETH(
          proof,{
          value: ethers.utils.parseEther(values.amount)
        });
        await txn.wait();
        console.log(txn);
        setIsLoading(false);
        setValues({ amount: "" });
        toast.success("Successful Buy!");
        console.log(txn, "got here");

      }
      else{
        const txn = await contract?.DepositETHPublic({
          value: ethers.utils.parseEther(values.amount)
        });
        await txn.wait();
        console.log(txn);
        setIsLoading(false);
        setValues({ amount: "" });
        toast.success("Successful Buy!");
        console.log(txn, "got here");
      }






    } catch (error) {
      setIsLoading(false);
      if (error instanceof ZodError) {
        toast.error("Invalid Input!");
        const errors = error?.flatten()?.fieldErrors as any;
        return setValidationError(errors);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "data" in error
      ) {
        toast.error(`${(error.data as { message: string }).message}`);
        console.log((error.data as { message: string }).message);
      } else {
        toast.error(`${error}`);
        console.log(error);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label className="font-spacegrotesk ">Enter Amount to buy</label>
      <div className="mt-2">
        <div>
          <div className="flex justify-between">
            <input
              value={values.amount.toString()}
              onChange={e => {
                if (validationError?.amount)
                  setValidationError({ amount: null });
                setValues(prevState => ({
                  ...prevState,
                  amount: e.target.value
                }));
              }}
              placeholder="0.0 ETH"
              className="border border-teal rounded-lg py-2 pl-1.5 text-black mr-3 flex-grow"
            />
            <button
              type="submit"
              className="bg-black border border-teal text-teal py-2 px-5 rounded-lg disabled:opacity-80"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Buy"}
            </button>
          </div>
          {validationError?.amount?.length ? (
            <span className="text-xs text-[red]">
              {validationError?.amount[0]}
            </span>
          ) : null}
        </div>
      </div>
      <p className="text-sm mb-8 mt-1">
        <span className="text-teal mr-4">
          Min. Buy:{" "}
          <span className="text-teal font-medium font-dmsans">0.05 ETH</span>
        </span>

        <span className="text-teal">
          Max. Buy:{" "}
          <span className="text-teal font-medium font-dmsans">0.2 ETH</span>
        </span>
      </p>
    </form>
  );
};

export default BuyForm;
