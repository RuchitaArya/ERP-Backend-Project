import bcrypt from "bcryptjs";
import { generate } from "generate-password";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";


const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

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
const CheckEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return true;
    }
    return false;
}
const passwordGenerator =  () => {
    return generate({
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilarCharacters: true,
    });
};
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

};


export const registerUser = async (req, res) => {
    const { email, role, deptId } = req.body;

    if (!email || !role || !deptId) {
        throw new CustomError("please fill all the fields.", 400);

    }
    const isUserExist = await CheckEmail(email);

    if (isUserExist) {
        throw new CustomError("User with this email already exists.", 400)
    }

    const password = passwordGenerator();
    console.log(password);
    
    const hashedpassword = await hashPassword(password)

    const user = new User();
    user.email= email;
    user.password =hashedpassword;
    user.role = role;
    user.deptId= deptId;
    
    
    const result = await user.save();

    res.status(201).json({
    success:true,
    message :"User Created Successfully",
    user: result,
     })
     
    
    
     //  anu -> fj,)kwP=2f#3
    // arnv -> arnv987
}