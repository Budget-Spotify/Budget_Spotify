import { Users } from "../../models/schemas/Users";
class UsersManagerController {

    static async getUserList(req: any, res: any) {
        try {
            let userList = await Users.find()
            if (userList.length === 0) {
                const data = {
                    status: 'empty',
                    message: 'there is no user in the List'
                }
                return res.status(200).json(data)
            } else {
                res.status(200).json({
                    status:'full',
                    list: userList
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Failed"
            })
        }
    }
}


export default UsersManagerController