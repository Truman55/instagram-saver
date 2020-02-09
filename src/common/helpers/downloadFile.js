export async function downloadToDevice (fileurl, postID) {
    return await new Promise(async (resolve, reject) => {
        const data = await fetch(fileurl);
        const blob = await data.blob();
    
        const folderpath = 'file:///storage/emulated/0/Download';
        const filename = `${Date.now()}_instagram-saver_${postID}.jpg`;
        window.resolveLocalFileSystemURL(folderpath, (dir) => {

            dir.getFile(filename, { create: true}, (file) => {
                file.createWriter((fileWriter) => {
                    fileWriter.write(blob);
                    resolve();
                }, (err) => {
                    reject(err)
                });
            });
        })
    });
}
