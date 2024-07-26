"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputComp from "@/components/ui/inputcomp";
import RadioContainer from "@/components/ui/radio";
import RadioComp from "@/components/ui/radiocomp";
import Section from "@/components/ui/section";
import { getFactoryContract } from "@/constants/contracts";
import { getProvider } from "@/constants/providers";
import { generateDaoCode } from "@/utils";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useEffect, useRef, useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";

export function CreateDAOForm({ onSubmit }: { onSubmit?: () => void }) {
  const { walletProvider } = useWeb3ModalProvider();
  const [loading, setLoading] = useState(false);
  const readWriteProvider = getProvider(walletProvider);
  const [contract, setContract] = useState<string>();

  const [inputValues, setInputValues] = useState({
    name: "My Governor",
    symbol: "",
    description: "",
  });

  useEffect(() => {
    setContract(generateDaoCode(inputValues));
  }, [inputValues]);


  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  async function createDao() {
    setLoading(true)
    const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

    // const signer = await readWriteProvider.getSigner();

    const contract = getFactoryContract(signer);
    try {
      const transaction = await contract.createNFT(
        inputValues.name,
        inputValues.symbol,
        inputValues.description
      );

      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);
      if (receipt.status === 1 && onSubmit) {
        onSubmit();
      }
      setLoading(false);

    } catch (error) {
      console.error("error: ", error);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[90%] ">

      <DialogHeader>
        <DialogTitle>Create Governance Contract</DialogTitle>
        <DialogDescription>
          Parameters the contract specifies to be passed in during deployment.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-row gap-6">
        <div className=" py-4 px-4 lg:w-6/12 max-h-[500px] overflow-y-auto h-fit scrollbar-thin">
          <Section title="settings">
            <InputComp label="Name" handleOnchange={handleInputChange} value={"My Governor"} />
            <div className="flex gap-5">
              <InputComp label="Voting Delay" handleOnchange={handleInputChange} value={"1 day"} />
              <InputComp label="Voting Period" handleOnchange={handleInputChange} value={"1 week"} />
            </div>
            <InputComp label="Proposal Threshold" handleOnchange={handleInputChange} value={"0"} />
            <InputComp label="Quorum %O #O" handleOnchange={handleInputChange} value={"4"} />
            <InputComp label="Token Decimal" handleOnchange={handleInputChange} value={"18"} />
            <RadioContainer value={"storage"} onValueChange={(e) => { }} className="flex flex-col gap-2.5">
              <RadioComp label="Updatable Settings" value="updatable" />
              <RadioComp label="Storage" value="storage" />
            </RadioContainer>
          </Section>
          <Section title="votes">
            <RadioContainer value={"erc20"} onValueChange={(e) => { }} className="flex flex-col gap-2.5">
              <RadioComp label="ERC20Votes" value="erc20" />
              <RadioComp label="ERC721Votes" value="erc721" />
            </RadioContainer>
          </Section>
          <Section title="Token Clock Mode">
            <RadioContainer value={"Block Number"} onValueChange={(e) => { }} className="flex flex-col gap-2.5">
              <RadioComp label="Block Number" value="Block Number" />
              <RadioComp label="Time Stamp" value="Time Stamp" />
            </RadioContainer>
          </Section>
          <Section title="timelock">
            <RadioContainer value={"Block Number"} onValueChange={(e) => { }} className="flex flex-col gap-2.5">
              <RadioComp label="TimelockController" value="Block Number" />
              <RadioComp label="Compound" value="Time Stamp" />
            </RadioContainer>
          </Section>
          <Section title="upgradeability">
            <RadioContainer value={"uups"} onValueChange={(e) => { }} className="flex flex-col gap-2.5">
              <RadioComp label="Transparent" value="transparent" />
              <RadioComp label="UUPS" value="uups" />
            </RadioContainer>
          </Section>
          <Section title="info">
            <InputComp label="Security Contact" handleOnchange={handleInputChange} value={""} />
          </Section>
        </div>
        {/* Display Codes Here */}
        <div className="w-[100%] relative max-h-[500px] scrollbar-thin">
          <CodeBlock
            text={contract}
            language={'solidity'}
            showLineNumbers={false}
            theme={dracula}
            customStyle={{ height: '100%', position: 'absolute', left: '0', top: '0', width: '100%' }}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading} onClick={() => {
          createDao()
        }}>{loading ? "Loading..." : "Deploy"}
        </Button>
      </DialogFooter>
    </DialogContent>
    // </Dialog>
  );
}
