import React, { useState, useRef } from "react";

export interface MyContract {
  network: any;
  user: any;
  fetchBalance: any;
  message: any;
  contract: any;
  fetchContractMessage: any;
}
let myContract: MyContract;

// export default function ContractCall({ network, user, fetchBalance, message, contract, fetchContractMessage }) {
export default function ContractCall(myContract: any) {
  const [newMessage, setNewMessage] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [txnHash, setTxnHash] = useState('');
  // const updateBtnRef = React.useRef<HTMLInputElement>(null);
  // const updateBtnRef = React.useRef(0);
  const updateBtnRef = React.useRef<HTMLButtonElement>(null);
  // Update contract `message` value on the blockchain
  const updateContractMessage = async () => {
    if (!newMessage) return;
    disableForm(updateBtnRef);
    const receipt = await myContract.contract.methods.update(newMessage).send({ from: myContract.user.publicAddress });
    setTxnHash(receipt.transactionHash);
    enableForm(updateBtnRef);
  }

  // Disable input form while the transaction is being confirmed
  const disableForm = (updateBtnRef: any) => {
    setTxnHash(''); // Clear link to previous transaction hash
    setDisabled(true);
    updateBtnRef.current.innerText = 'Submitted...';
  }

  // Re-enable input form once the transaction is confirmed
  const enableForm = (updateBtnRef: any) => {
    setDisabled(false);
    setNewMessage('');
    myContract.fetchBalance(myContract.user.publicAddress);
    myContract.fetchContractMessage()
    updateBtnRef.current.innerText = 'Update';
  }


  return (
    <div className="container">
      <h1>Contract Message</h1>
      <div className="info">{myContract.message}</div>

      <h1>Update Message</h1>
      <input type="text" disabled={disabled} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="full-width" placeholder="New Message" />
      <button disabled={disabled} ref={updateBtnRef} onClick={updateContractMessage}>Update</button>
      {
        txnHash &&
        <div className="info">
          <a href={myContract.network === "ethereum" ? `https://ropsten.etherscan.io/tx/${txnHash}` : `https://explorer-mumbai.maticvigil.com/tx/${txnHash}`} target="_blank">
            View Transaction
          </a> ↗️
        </div>
      }
    </div>
  )
}