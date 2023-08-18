import {Notifies} from "../../models/schemas/Notify";

export class NotifyController {
    static async createNotify(entityType: string, playlist: object, song: object, action: string) {
        try {
            const notify = await Notifies.create({
                entityType: entityType,
                playlist: playlist,
                song: song,
                action: action
            });
            return {message: "Create notify complete", detail: notify};
        } catch (e) {
            return {message: "Create notify complete", detail: e};
        }
    }

    static async deleteNotify() {

    }
}