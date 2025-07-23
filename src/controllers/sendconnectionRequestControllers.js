// this api is just for ignored or interested api status

import { ConnectionRequest } from "../models/connectionRequest.js";

import { User } from "../models/user.js";

export const sendConnectionRequest = async (req, res) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;
  const fromUserName = req.user.firstName;

  try {
    if (status === "ignored" || status === "interested") {
      if (toUserId === fromUserId) {
        console.log("hi");
        return res.json({
          message: "Cannot send the connection request to same.",
        });
      }
      const alreadySent = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }, // deadlock na lga jaise ki a ne b ko bhja request phir b ne a ko bhj diya
        ],
      });
      if (alreadySent) {
        return res.status(400).json(`Already sent the connection request to}`);
      }
      //   if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      //     return res.status(400).json({ message: "Invalid user ID format." });
      //   }

      const isUserAvailable = await User.findById(toUserId);
      if (!isUserAvailable) {
        console.log("hi vicky");
        return res.status(404).json({ message: "User id not available." });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          fromUserName + " is " + status + " in " + isUserAvailable.firstName,
        data,
      });
    } else {
      return res.status(401).json({
        message: `Status should be either "Ignored" or "interested" and you sent ${status}`,
      });
    }
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
};

export const reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const status = req.params.status
    const requestId = req.params.requestId

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.json({ message: `${status} is not allowed` });
    }

    const validConnectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!validConnectionRequest) {
      console.log("mpomomomomo");
      
      return res.status(404).json({
        message: "connection request not find.",
      });
    }

    validConnectionRequest.status = status;
    const data = await validConnectionRequest.save();
    res.json({
      message: "connection request " + status,
      data,
    });
  } catch (err) {
    return res.json({ message: err.message });
  }
};
