import app from "./app.js";
import { dbConnect } from "./config/db-connect.js";

const main = async () => {
    const PORT = process.env.PORT || 8080;
   
    try {
        await dbConnect();
        
        app.listen(PORT, () => {
            console.log(`server is runing at port ${PORT}`);
        });
    }
    catch (err) {
        // console.log("", err);
        throw err;
    }
};
main().catch((err) => {
    console.log(err.message)
    process.exit(1);//to stop the node.js process
})
