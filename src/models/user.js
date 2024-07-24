import  { Schema,model } from "mongoose";

const roleEnum =Object.freeze({
    ADMIN:"admin",
    MANAGER:"manager",
    EMPLOYEE:"employee",
});
const userSchema = new Schema(
    {
    name: {
        type: String,
        required: false,
    },
    contactNo: {
        type: Number,
        required: false,
    },
    email: {
        type:String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    deptId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userPermissions: [
        {
            type: Schema.Types.ObjectId,
            required: false,
        },
        
    ],
},
{
    timestamps: true,
}
);
 
 export const User= model('User',userSchema);