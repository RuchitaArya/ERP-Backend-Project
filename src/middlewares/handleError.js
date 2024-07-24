export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err?.status || 500);
    res.json({ message: err?.message || "Internal server Error" });
}
export const catchAsync=(handler)=>{
    return(req, res , next)=>{
       const result= handler(req,res);

       result.catch((err)=>{

        next(err);
       });
    };
};