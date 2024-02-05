import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import faucetContract from "./ethereum/faucet";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState();
  const [withdrawSuccess, setWithdrawSuccess] = useState();
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    // Web3Modal is a library that simplifies the process of connecting to a user's Ethereum wallet, like MetaMask.
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    if (provider) {
      try {
        const getnetwork = await provider.getNetwork();
        const mumbaiChainId = 80001;

        if (getnetwork.chainId != mumbaiChainId) {
          alert("please switch to Polygon Mumbai Testnet");
          return;
        }
        const signer = await provider.getSigner();
        if (signer) {
          const account = await signer.getAddress();
          setSigner(signer);
          setFcContract(faucetContract(provider));
          setWalletAddress(account);
        } else {
          setWalletAddress();
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      // MetaMask is not installed
      alert("Please install MetaMask extension first!");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getTokens = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      if (await fcContractWithSigner.dripCheck(walletAddress)) {
        const resp = await fcContractWithSigner.drip({
          gasLimit: 300000, // Set an appropriate gas limit
        });
        await resp.wait();
        setWithdrawSuccess("Transaction successful - enjoy tokens!");
        setTransactionData(resp.hash);
      } else {
        throw new Error("Recipient has to wait for 5 minutes");
      }
    } catch (error) {
      if (error.message.search("not a valid acccount") !== -1)
        setWithdrawError("Not a valid acccount");
      else if (error.message.search("Insufficient balance") !== -1)
        setWithdrawError("Insufficient balance");
      else if (
        error.message.search("Recipient has to wait for 5 minutes") !== -1
      )
        setWithdrawError("Recipient has to wait for 5 minutes");
      else setWithdrawError(error.message);
    }
  };
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Ash Token (ASH)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet</h1>
            <p>Fast and reliable. Get 100 Ash-Token/5 minutes.</p>
            <p>Make sure you are connected to Mumbai test network</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={getTokens}
                    disabled={walletAddress ? false : true}
                  >
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">
                  AshToken(ERC20) Contract Address
                </p>
                <div className="panel-block">
                  <p>
                    Contract Address:
                    <b>0x1e08A11FB5681485e05975Cc7b14F0Beda969afa</b>
                  </p>
                </div>
              </article>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>
                    {transactionData
                      ? `transaction Data : ${transactionData}`
                      : "-- "}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
