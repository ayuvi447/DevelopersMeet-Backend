import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { validateSignUpData } from "../helpersFunctions/validations.js";
import { validateSigninData } from "../helpersFunctions/validations.js";
export const register = async (req, res) => {
  const { firstName, lastName, emailId, password, gender, photoUrl, skills } =
    req.body;

  try {
    //   if (
    //     !firstName ||
    //     !lastName ||
    //     !emailId ||
    //     !password ||
    //     !gender ||
    //     !photoUrl ||
    //     !skills
    //   ) {
    //     return res.status(401).send("All fields are required to get signedUp.");
    //   }

    //   const hasUser = await User.findOne({ emailId });
    //   if (hasUser) {
    //    return res.send("user already exists");
    //   }
    //   if(!validator.isEmail(emailId)){
    //     throw new Error ('Invalid email formate.')
    //   }

    validateSignUpData(req);

    // encrypt the password

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Hashed password", hashedPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    console.log("Token", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    console.log(user);

    return res.json({
      message: "User signedUp Successfully.",
      data: savedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateSigninData(req);

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).send("User credentials are wrong.");
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      // create json web token
      // const tokenDemo = await jwt.sign({ _id: userEmail?._id }, "Vicky@123", {expiresIn:'0d'});
      const token = await user.getJWT();
      console.log("Token", token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    }
  } catch (error) {
    res.status(401).send({ message: "Invalid email or password" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("user Logout successfully.");
};

export const updataProfile = async (req, res) => {
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    // Only allow allowed fields
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      return res.status(400).json({ message: "Update not allowed." });
    }

    // 🔍 VALIDATION SECTION
    const nameRegex = /^[A-Za-z]+$/;

    if (!data.firstName || !nameRegex.test(data.firstName.trim())) {
      return res.status(400).json({
        message: "First name must contain only letters and cannot be empty.",
      });
    }

    if (!data.lastName || !nameRegex.test(data.lastName.trim())) {
      return res.status(400).json({
        message: "Last name must contain only letters and cannot be empty.",
      });
    }

    if (
      data.gender &&
      !["male", "female"].includes(data.gender.toLowerCase())
    ) {
      return res.status(400).json({
        message: "Gender must be either 'male' or 'female'.",
      });
    }

    if (data.skills && data.skills.length > 10) {
      return res.status(400).json({
        message: "Not allowed more than 10 skills.",
      });
    }

    // ✅ UPDATE LOGIC
    const loggedinUser = req.user;

    Object.keys(data).forEach((key) => {
      loggedinUser[key] = data[key];
    });

    await loggedinUser.save();

    res.status(200).json({
      message: `${loggedinUser.firstName}, your profile has been updated.`,
      data: loggedinUser,
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

export const deleteProfile = async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findByIdAndDelete({ _id: _id });
    res.send("user deleted successfully.");
  } catch (err) {
    console.log(err);
  }
};

export const forgetPassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).send("Current and new password are required.");
    }

    const user = await User.findById(userId);
    console.log(typeof user);

    if (!user || !user.password) {
      return res.status(404).send("User not found or password missing.");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).send("Current password is incorrect.");

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send("Password updated successfully.");
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).send("Internal server error.");
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  console.log(users.length);

  res.send(users);
};
