import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { magicEthereum, magicMatic, ethWeb3, maticWeb3 } from "../magic";
import Loading from "./Loading";
import ContractCall from "./ContractCall";
import SendTransaction from './SendTransaction';
import Info from "./Info";
import { abi } from '../contract/abi.js';
import { AbiItem } from "web3-utils";
import { MagicUserMetadata } from "magic-sdk";

export default function Home() {
  const abiItem: AbiItem = {
    type: "function"
  };
  const [magic, setMagic] = useState(magicEthereum);
  const web3 = magic.network === "ethereum" ? ethWeb3 : maticWeb3;
  // const [user, setUser] = useState<IUser>({name: 'Jon'});
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata>({ email: '', issuer: '', phoneNumber: '', publicAddress: '' });
  const [balance, setBalance] = useState('...');
  const network = magic.network === "ethereum" ? 'ethereum' : 'matic';
  const ropstenContractAddress = '0x3EA3913A352cDd49889c7b0dEc8Dd9491d063453';
  const maticContractAddress = '0xfD827cC6d5b959287D7e1680dBA587ffE5dFcbB4';
  const contract = new web3.eth.Contract(abiItem, network === "ethereum" ? ropstenContractAddress : maticContractAddress);
  const [message, setMessage] = useState('...');
  const history = useHistory();

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile, balance and contract message.
    magic.user.isLoggedIn().then(magicIsLoggedIn => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(user => {
          setUserMetadata(user);
          fetchBalance(user.publicAddress);
          fetchContractMessage();
        });
      } else {
        // If no user is logged in, redirect to `/login`
        history.push("/login");
      }
    });
  }, [magic]);

  const handleChangeNetwork = (e: { target: { value: string; }; }) => {
    e.target.value === 'ethereum' ? setMagic(magicEthereum) : setMagic(magicMatic);
    fetchBalance(userMetadata.publicAddress);
    fetchContractMessage();
  }

  const fetchBalance = (address: MagicUserMetadata["publicAddress"]) => {
    // @ignore-ts
    web3.eth.getBalance(address).then(bal => setBalance(web3.utils.fromWei(bal)))
  }

  const fetchContractMessage = () => contract.methods.message().call().then(setMessage)

  return (
    userMetadata ? (
      <>
        <Info handleChangeNetwork={handleChangeNetwork} balance={balance} user={userMetadata} magic={magic} />
        <SendTransaction web3={web3} network={network} publicAddress={userMetadata.publicAddress} fetchBalance={fetchBalance} />
        <ContractCall network={network} contract={contract} user={userMetadata} fetchBalance={fetchBalance} message={message} fetchContractMessage={fetchContractMessage} />
      </>
    ) : <Loading />
  );
}

