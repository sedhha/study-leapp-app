// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ContentCreator {
    struct Content {
        uint256 contentID;
        address creatorAddress;
        string contentText;
        string[] categories;
        uint256 upvotes;
        uint256 score;
    }
    
    Content[] public contents;
    uint256 private nextContentID;
    
    constructor() {
        nextContentID = 0;
    }
    
    function addContent(string memory _contentText, string[] memory _categories) public {
        Content memory newContent;
        newContent.contentID = nextContentID;
        newContent.creatorAddress = msg.sender;
        newContent.contentText = _contentText;
        newContent.categories = _categories;
        newContent.upvotes = 0;
        newContent.score = 0;
        
        contents.push(newContent);
        
        nextContentID++;
    }
    
    function getContent(uint256 _index) public view returns (
        uint256 contentID,
        address creatorAddress,
        string memory contentText,
        string[] memory categories,
        uint256 upvotes,
        uint256 score
    ) {
        require(_index < contents.length, "Invalid index");
        
        Content storage content = contents[_index];
        contentID = content.contentID;
        creatorAddress = content.creatorAddress;
        contentText = content.contentText;
        categories = content.categories;
        upvotes = content.upvotes;
        score = content.score;
    }
    
    function upvoteContentByID(uint256 _contentID) public {
        uint256 index = findContentIndexByID(_contentID);
        require(index != contents.length, "Content not found");
        
        contents[index].upvotes++;
        
        if (contents[index].upvotes % 10 == 0) {
            contents[index].score++;
        }
    }
    
    function getContentByCreator(address _creatorAddress) public view returns (Content[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < contents.length; i++) {
            if (contents[i].creatorAddress == _creatorAddress) {
                count++;
            }
        }
        
        Content[] memory result = new Content[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < contents.length; i++) {
            if (contents[i].creatorAddress == _creatorAddress) {
                result[index] = contents[i];
                index++;
            }
        }
        
        return result;
    }

    function getContentByCategories(string[] memory _categories) public view returns (Content[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 0; i < contents.length; i++) {
            Content storage content = contents[i];
            for (uint256 j = 0; j < content.categories.length; j++) {
                for (uint256 k = 0; k < _categories.length; k++) {
                    if (keccak256(bytes(content.categories[j])) == keccak256(bytes(_categories[k]))) {
                        count++;
                        break;
                    }
                }
            }
        }
        
        Content[] memory result = new Content[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < contents.length; i++) {
            Content storage content = contents[i];
            for (uint256 j = 0; j < content.categories.length; j++) {
                for (uint256 k = 0; k < _categories.length; k++) {
                    if (keccak256(bytes(content.categories[j])) == keccak256(bytes(_categories[k]))) {
                        result[index] = content;
                        index++;
                        break;
                    }
                }
            }
        }
        
        return result;
    }
    
    function findContentIndexByID(uint256 _contentID) internal view returns (uint256) {
        for (uint256 i = 0; i < contents.length; i++) {
            if (contents[i].contentID == _contentID) {
                return i;
            }
        }
        return contents.length;
    }
}
