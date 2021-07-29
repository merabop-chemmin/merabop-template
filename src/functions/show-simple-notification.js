import { Notify } from "quasar";

export function showSimpleNotification({type, title, message, timeout}) {
    let ICON

    // type => info,
    if (type === 'info') {
        ICON = "eva-info-outline"
    } else if (type === 'positive') {
        ICON = "eva-checkmark-circle-outline"
    } else if (type === 'warning') {
        ICON = "eva-alert-triangle-outline"
    } else if (type === 'negative') {
        ICON = "eva-alert-circle-outline"
    } else {
        ICON = ""
    }

    Notify.create({
        message: `<span class="text-subtitle2 text-grey-9 tracking-wide"> ${title} </span>`,
        caption: `<span class="text-caption text-grey-9"> ${message} </span>`,
        html: true,
        icon: ICON,
        position: "top-right",
        // multiLine: true,
        color: "white",
        textColor: type,
        classes: "shadow-1",
        group: false,
        timeout: timeout || 0,
        actions: [
            { icon: "eva-close-outline", color: "grey-9", dense: true }
        ]
    })
}