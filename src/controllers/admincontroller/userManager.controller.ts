import { Users } from "../../models/schemas/Users";
class UsersManagerController {

    static async getUserList(req: any, res: any) {
        try {
            let userList = await Users.find()
            if (userList) {
                res.status(200).json(userList)
            } else {
                res.status(500).json({
                    message: "Failed"
                })
            }
        }catch(err){
            console.log(err);
        }
   }
}


export default UsersManagerController