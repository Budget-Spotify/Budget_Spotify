import {Notifies} from "../../models/schemas/Notify";
import {Users} from "../../models/schemas/Users";

export class NotifyController {
    static async createNotify(entityType: string, playlist: object, song: object, action: string, req: any) {
        try {
            const userId = req.user.id
            const user = await Users.findById(userId)

            const notify = await Notifies.create({
                entityType: entityType,
                playlist: playlist,
                song: song,
                action: action,
                source: user,
            });
            return {message: "Create notify complete", detail: notify};
        } catch (e) {
            return {message: "Create notify complete", detail: e};
        }
    }

    static async deleteNotify() {

    }
}