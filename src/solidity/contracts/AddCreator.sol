// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CreatorRegistry {
    struct Creator {
        address walletAddress;
        string name;
        string b64Image;
    }

    Creator[] public creators;
    mapping(address => bool) public isCreatorRegistered;

    function signup(address _walletAddress, string memory _name, string memory _b64Image) public {
        require(!isCreatorRegistered[_walletAddress], "Address is already registered");

        Creator memory newCreator;
        newCreator.walletAddress = _walletAddress;
        newCreator.name = _name;
        newCreator.b64Image = _b64Image;

        creators.push(newCreator);
        isCreatorRegistered[_walletAddress] = true;
    }

    function getCreator(uint256 _index) public view returns (
        address walletAddress,
        string memory name,
        string memory b64Image
    ) {
        require(_index < creators.length, "Invalid index");

        Creator storage creator = creators[_index];
        walletAddress = creator.walletAddress;
        name = creator.name;
        b64Image = creator.b64Image;
    }

    function getCreatorCount() public view returns (uint256) {
        return creators.length;
    }

    function getCreatorByAddress(address _walletAddress) public view returns (
        address walletAddress,
        string memory name,
        string memory b64Image
    ) {
        for (uint256 i = 0; i < creators.length; i++) {
            Creator storage creator = creators[i];
            if (creator.walletAddress == _walletAddress) {
                walletAddress = creator.walletAddress;
                name = creator.name;
                b64Image = creator.b64Image;
                return (walletAddress, name, b64Image);
            }
        }

        // Creator not found
        return(walletAddress, "Not Found", "Not Found");
    }
}
