import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generate } from "generate-password";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
const checkPassword = async (password, actualPassword) => {

    const isMatched = await bcrypt.compare(password, actualPassword);
    if (!isMatched) {
        throw new CustomError("Your Password is incorrect", 401);
    }
    return true;
}
const createAdmin = async (email, password) => {
    // .)role create -> Admin
    const role = await Role.create({ name: "admin" });
    //    .) Management dept create
    const dept = await Department.create({ name: "Management" })
    // password->encrypt-decrypt/hashing
    // Hash the Password
    const hashedpassword = await hashPassword(password)
    // .) Admin permission
    const permissions = await Permission.find({
        name: "Administrator Access",
    }).select("_id");
    // .) Admin user create
    const user = await User.create({
        email,
        password: hashedpassword,
        role: role._id,
        deptId: dept._id,
        userPermissions: permissions,
    });

    return user;
};
const checkEmail = async (email) => {
    return await User.findOne({ email })
        .populate({ path: "role", select: "name _id" })
        .populate({ path: "deptId", select: "name _id" })

        .populate({ path: "userPermissions", select: "name _id" })
};
const passwordGenerator = () => {
    return generate({
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilarCharacters: true,
    });
};
const generateAccessToken = (userId) => {
    // require('crypto').randomBytes(64).toString('hex')
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: "10m",
        });
}
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: "7d",
        });
}
const verifyRefreshToken = (token) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
        return decodedToken;
    } catch (err) {
        throw new CustomError("Session Expired.", 403)
    }
}

//for adding user/employee
export const registerUser = async (req, res) => {
    const { email, role, deptId } = req.body;

    if (!email || !role || !deptId) {
        throw new CustomError("please fill all the fields.", 400);

    }
    const isUserExist = await checkEmail(email);

    if (isUserExist) {
        throw new CustomError("User with this email already exists.", 400)
    }

    const password = passwordGenerator();
    console.log(password);

    const hashedpassword = await hashPassword(password)

    const user = new User();
    user.email = email;
    user.password = hashedpassword;
    user.role = role;
    user.deptId = deptId;


    const result = await user.save();

    res.status(201).json({
        success: true,
        message: "User Created Successfully",
        user: result,
    })


    // avni-> J19Yw1)f>(Z~
    //  anu -> fj,)kwP=2f#3
    // arnv -> arnv987
};

// for login
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError("please fill all the fields", 400);

    }
    //  1) check whether any user exists or not
    const existingUser = await User.find();

    if (existingUser.length === 0) {
        const user = await createAdmin(email, password);

        if (user) {
            return res.status(201).json({ success: true, message: "Admin Created Successfully", user });
        }
    }

    // Check whether the email exists or not 
    const user = await checkEmail(email);
    if (!user) {
        throw new CustomError("Your account does exist with us.", 401)
    }

    // Check Password
    await checkPassword(password, user.password)

    // Generate Access Token and Refresh Token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = {
        userId: user._id,
        name: user?.name,
        email: user.email,
        role: user.role,
        department: user.deptId,
        userPermissions: user.userPermissions,
    };

    res.cookie("jwt", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure:true,
        // sameSite:"none",
        // domain:".abc.com",

    })
    //    frontend ->abc.com
    // backend -> api.abc.com
    res.status(200).json({
        success: true,
        message: "Login Successfully",
        accessToken,
        user: userObj,
    });
};
// for generating new access token
export const getNewAccessTocken = async (req, res) => {
    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) {
        throw new CustomError("Session Expried", 403)
    }
    const decodedToken = verifyRefreshToken(refreshToken);
    console.log(decodedToken);
    const accessToken = generateAccessToken(decodedToken.userId);

    const user = await User.findById(decodedToken.userId)
    const userObj = {
        userId: user._id,
        name: user?.name,
        email: user.email,
        role: user.role,
        department: user.deptId,
        userPermissions: user.userPermissions,
    };
    res.status(200).json({ accessToken, user: userObj });
};
export const logout = async (req, res) => {
    res.clearCookie("jwt", {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure:true,
        // sameSite:"none",
        // domain:".abc.com",
    });
    res.status(204).end();
};