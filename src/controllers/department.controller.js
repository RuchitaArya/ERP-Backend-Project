import { CustomError } from "../utils/index.js";
import { Department } from "../models/index.js";


export const createDept = async (req, res) => {

    const { name } = req.body;
    console.log(req.user);
    return;

    if (!name) {
         throw new CustomError("plese fill all the fields.", 400)
    }
    
    const department = await Department.create({ name });
   
    res.status(201).json({
        success: true,
        department,
        massage: "Department created successfully",

    });

};

export const getDepts =async (req, res ) => {
    const departments= await Department.find()
    res.status(200).json({
        success: true,
        data: departments,
    });
};

export const deleteDept = async(req, res ) => {
    const { deptId } = req.params;

    const department=await Department.findById(deptId)
    if (!department){
        throw new CustomError("Department does not exist",400)
    }

     const result= await Department.findByIdAndDelete(deptId);
    // console.log(result);

    res.status(200).json({ success: true, message: "Department deleted successfully." });
};
export const updateDept = async(req, res) => {
    const { deptId } = req.params;
    const { name } = req.body;

    if (!name || !deptId) {
        throw new CustomError("please fill all the fields.", 400);
    }
    const existingDept = await Department.findById(deptId)

    if(!existingDept){
        throw new CustomError("Department does not exist",400)
    }
    const result = await Department.findByIdAndUpdate(deptId,{name});

    res.status(200).json({ success: true, message: "department update successfully." });
};