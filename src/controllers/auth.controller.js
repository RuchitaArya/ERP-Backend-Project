import bcrypt from "bcryptjs";
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";


const hashPassword= async(password)=>{
    const saltRounds=10;
  return await bcrypt.hash(password, saltRounds);
};

const createAdmin = async (email, password) => {
// .)role create -> Admin
    const role = await Role.create({ name: "admin" });
//    .) Management dept create
    const dept = await Department.create({ name: "Management" })
// password->encrypt-decrypt/hashing
// Hash the Password
const hashedpassword =await hashPassword(password)
// .) Admin permission
const permissions= await Permission.find({
    name:"Administrator Access",
    }).select("_id");
// .) Admin user create
    const user = await User.create({
        email, 
        password : hashedpassword, 
        role: role._id, 
        deptId: dept._id,
        userPermissions: permissions,
    });
    
    return user;
};

export const login = async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError("please fill all the fields", 400);

    }
//  1) check whether any user exists or not
    const existingUser = await User.find();

    if (existingUser.length === 0) {
       const user= await createAdmin(email, password);
    
       if(user){
        return res.status(201).json({success:true,message:"Admin Created Successfully",user});
    }
    }

};