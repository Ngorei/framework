export function notifProgram(item) {
     const STG = new Dom.Storage();
     const notif = STG.Firebase('notifikasi');
     notif.add(item)

}