// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DigitalArtNFT {
    struct Art {
        string title;
        string artist;
        string uri; // URI for the digital art
        address owner;
    }

    mapping(uint256 => Art) public artworks;
    mapping(address => uint256[]) public ownerArtworks;
    mapping(uint256 => address) public artworkApprovals;

    uint256 public totalArtworks;

    event ArtCreated(uint256 indexed tokenId, string title, string artist, string uri, address owner);
    event ArtTransferred(uint256 indexed tokenId, address from, address to);

    function createArt(string memory title, string memory artist, string memory uri) public {
        uint256 tokenId = totalArtworks;
        artworks[tokenId] = Art(title, artist, uri, msg.sender);
        ownerArtworks[msg.sender].push(tokenId);
        emit ArtCreated(tokenId, title, artist, uri, msg.sender);
        totalArtworks++;
    }

    function getArt(uint256 tokenId) public view returns (Art memory) {
        require(tokenId < totalArtworks, "Art does not exist");
        return artworks[tokenId];
    }

    function transferArt(address to, uint256 tokenId) public {
        require(artworks[tokenId].owner == msg.sender, "You do not own this art");
        require(to != address(0), "Invalid address");

        // Update ownership
        artworks[tokenId].owner = to;

        // Remove tokenId from the sender's list
        removeArtFromOwner(msg.sender, tokenId);
        // Add tokenId to the new owner's list
        ownerArtworks[to].push(tokenId);

        emit ArtTransferred(tokenId, msg.sender, to);
    }

    function removeArtFromOwner(address owner, uint256 tokenId) internal {
        uint256[] storage artList = ownerArtworks[owner];
        for (uint256 i = 0; i < artList.length; i++) {
            if (artList[i] == tokenId) {
                artList[i] = artList[artList.length - 1]; // Replace with the last element
                artList.pop(); // Remove the last element
                break;
            }
        }
    }

    function getArtByOwner(address owner) public view returns (uint256[] memory) {
        return ownerArtworks[owner];
    }
}
