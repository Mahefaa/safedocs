//SPDX - License - Identifier : MIT
pragma solidity ^0.8.0;
contract FileStorage {
    struct File {
        string name ;
        string ipfsHash ;
    }
    mapping ( address => File[]) public files ;
    function addFile(string memory _name, string memory _ipfsHash) public {
        files[msg.sender].push(File( _name, _ipfsHash));
    }
    function getFiles() public view returns ( File[] memory ) {
        return files [msg.sender];
    }
}