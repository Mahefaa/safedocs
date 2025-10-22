import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {create as createStoracha} from "@storacha/client";
import FileStorageJSON from "../abi/FileStorage.json";

const CONTRACT_ADDRESS =
    import.meta.env.VITE_CONTRACT_ADDRESS ||
    "";
const DID_SPACE = "";
export default function App() {
    const [account, setAccount] = useState(null);
    const [client, setClient] = useState(null);
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState("Idle");
    const [email, setEmail] = useState("");

    // Initialize Storacha client
    useEffect(() => {
        (async () => {
            setStatus("Initializing Storacha client...");
            try {
                const c = await createStoracha();
                setClient(c);
                setStatus("Storacha client ready.");
            } catch (err) {
                console.error(err);
                setStatus("Failed to initialize Storacha: " + err.message);
            }
        })();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Install MetaMask");
        try {
            const [addr] = await window.ethereum.request({method: "eth_requestAccounts"});
            setAccount(addr);
            setStatus("Wallet connected: " + addr);
        } catch (err) {
            console.error(err);
            setStatus("Wallet connection failed: " + err.message);
        }
    };

    // Authenticate Storacha via email
    const storachaLogin = async () => {
        if (!client) return alert("Storacha client not ready");
        if (!email) return alert("Enter your email");

        setStatus("Authenticating Storacha via email...");
        try {
            await client.login(email); // current supported method
            // Create or get space
            let spaceId = DID_SPACE;
            await client.setCurrentSpace(spaceId);
            setStatus("Storacha authenticated. Space ready: " + (spaceId));
        } catch (err) {
            console.error(err);
            setStatus("Authentication failed: " + err.message);
        }
    };

    const uploadFile = async () => {
        if (!file) return alert("Select a file");
        if (!client) return alert("Storacha not authenticated");

        setStatus("Uploading file to Storacha...");
        try {
            const result =
                typeof client.uploadFile === "function"
                    ? await client.uploadFile(file)
                    : typeof client.put === "function"
                        ? await client.put([file])
                        : null;

            const cid =
                (result && (result.cid || result)) ||
                (typeof result === "string" ? result : null);
            if (!cid) return setStatus("Upload failed, no CID returned");
            console.log("Uploading file to Storacha..." + cid);
            setStatus("Recording CID on Ethereum...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, FileStorageJSON.abi, signer);
            const tx = await contract.addFile(file.name, cid.toString());
            await tx.wait();

            setStatus("Upload complete!");
            setFile(null);
            await listFiles();
        } catch (err) {
            console.error(err);
            setStatus("Upload failed: " + err.message);
        }
    };

    const listFiles = async () => {
        if (!account) return alert("Connect wallet first");
        setStatus("Loading files from chain...");
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, FileStorageJSON.abi, provider);
            const raw = await contract.getFiles();
            setFiles(raw.map((f) => ({name: f.name, ipfsHash: f.ipfsHash})));
            setStatus("Files loaded: " + raw.length);
        } catch (err) {
            console.error(err);
            setStatus("Failed to load files: " + err.message);
        }
    };

    return (
        <div style={{fontFamily: "Inter, system-ui, sans-serif", padding: 20, maxWidth: 900}}>
            <h1>SafeDocs DApp — Storacha + Sepolia</h1>
            <p style={{color: "#666"}}>{status}</p>

            {!account ? (
                <button onClick={connectWallet}>Connect MetaMask</button>
            ) : (
                <div>
                    <div>Connected: <code>{account}</code></div>
                    <div style={{marginTop: 10}}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={storachaLogin} style={{marginLeft: 10}}>
                            Authenticate Storacha
                        </button>
                    </div>
                </div>
            )}

            <div style={{marginTop: 20}}>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
                <button onClick={uploadFile} style={{marginLeft: 10}}>Upload</button>
            </div>

            <div style={{marginTop: 20}}>
                <button onClick={listFiles}>List My Files</button>
            </div>

            <ul style={{marginTop: 20}}>
                {files.map((f, i) => (
                    <li key={i}>
                        <a href={`https://storacha.link/ipfs/${f.ipfsHash}`} target="_blank" rel="noreferrer">
                            {f.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
