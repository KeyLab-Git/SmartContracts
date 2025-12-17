// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract TipContract {
    address public platform; // address that receives 5% fee

    event TipSent(
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        uint256 fee
    );

    constructor(address _platform) {
        require(_platform != address(0), "Invalid platform address");
        platform = _platform;
    }

    function sendTip(address receiver) public payable {
        require(msg.value > 0, "Tip must be greater than 0");
        require(receiver != address(0), "Invalid receiver");

        uint256 fee = (msg.value * 5) / 100; // 5% fee
        uint256 receiverAmount = msg.value - fee; // 95% goes to receiver

        // Send fee to platform
        (bool sentFee, ) = payable(platform).call{value: fee}("");
        require(sentFee, "Failed to send fee");

        // Send remaining to receiver
        (bool sentReceiver, ) = payable(receiver).call{value: receiverAmount}(
            ""
        );
        require(sentReceiver, "Failed to send tip");

        emit TipSent(msg.sender, receiver, receiverAmount, fee);
    }
    
}
