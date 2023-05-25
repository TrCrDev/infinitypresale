import { z, ZodError } from "zod";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { useAccount, useDisconnect } from "wagmi";
import toast from "react-hot-toast";
import { ethers } from "ethers";

import { PresaleContract } from "../custom-hooks/contracts";

const ClaimForm = () => {
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

      const txn = await contract?.claim();
      await txn.wait();

      console.log(txn);
      setIsLoading(false);
      setValues({ amount: "" });
      toast.success("Successful Claim!");
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
      <div className="mt-2">
        <div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-black border border-teal 
            
              text-teal py-2 px-5 rounded-lg font-bold disabled:opacity-80"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Claim"}
            </button>
          </div>
          {validationError?.amount?.length ? (
            <span className="text-xs text-[red]">
              {validationError?.amount[0]}
            </span>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default ClaimForm;
