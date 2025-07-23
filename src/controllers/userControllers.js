import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
export const userRequestsRecieved = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connentionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");
    res.json({
      message: "data fetched successfully",
      data: connentionRequests,
    });
  } catch (error) {
    return res.json({
      message: "Error " + error.message,
    });
  }
};

const USER_SAFE_DATA = "firstName lastName skills gender about age photoUrl";

// ye api sare connection request deti hai
export const connections = async (req, res) => {
  try {
    const loggedInUser = req.user;
    

    const connectionRequest = await ConnectionRequest.find({
     $or:[
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}
     ]
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error occurred: " + error.message,
    });
  }
};

export const feed = async (req, res) => {
  try {
    // user should see all the card expects
    // his own card
    // his connections
    // ignored people
    // already sent the connection request

    const loggedInUser = req.user;

    //pagination feature

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit; // agr user jyadda limit bhj dega to
    const skip = (page - 1) * limit;

    // find all the connection request i have sent or received

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    console.log(hideUserFromFeed);

    const users = await User.find({
      $and: [
        // $nin ---->>> mtlb not in Array
        // $ne ----->>> mtlb not equals
        { _id: { $nin: Array.from(hideUserFromFeed) } }, // ye unhi users ko select krti h jo hideUserfromFeed m nhi h
        { _id: { $ne: loggedInUser._id } }, // aur ye query loggedin user ko nhi selectkrti hai
      ],
    })
      .select("firstName lastName gender photoUrl skills about age")
      .skip(skip)
      .limit(limit);

    return res.json({
      message: "Users those i have not sent or received requests. ",
      users,
    });
  } catch (error) {
    return res.json({
      message: "error occured" + error.message,
    });
  }
};
