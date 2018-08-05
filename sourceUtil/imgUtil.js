import config from '../config'
import {getGlobalData} from '@/common/globalData'

const LOCAL_KEY = 'activity-hand-images';
function getLocal(key) {
    return new Promise((done, notDone) => {
        wx.getStorage({
            key,
            success: (res) => {
                done(res.data);
            },
            fail: (err) => {
                notDone(err)
            }
        })
    })
}
function setLocal(key, data) {
    return new Promise((done, notDone) => {
        wx.setStorage({
            key,
            data,
            success: done,
            fail: notDone,
        })
    })
}
function loadImage(url) {
    return new Promise((done, notDone) => {
        wx.downloadFile({
            url,
            success: (res) => {
                done(res.tempFilePath);
            },
            fail: (err) => {
                notDone(err)
            }
        })
    })
}
function saveFile(temp){
    return new Promise((done, notDone)=>{
        wx.saveFile({
            tempFilePath: temp,
            success: res=>{
                done(res.savedFilePath);
            },
            fail: err => {
                notDone(err);
            }
        })
    })
}
function isEmptyObject(obj){
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}
export function loadUserLogo(){
    return new Promise((done, notDone)=>{
        let logoUrl = getGlobalData('userAvatarUrl')
        if(!logoUrl){
            logoUrl = config.imgFiles.defaultUserLogo.url;
        }
        loadImage(logoUrl).then(tempFilePath=>{
            done(tempFilePath);
        }).catch(e=>{
            console.info('load user logo error', e);
            notDone(e);
        })
    })
}
export function loadInitImage() {
    let imgNames = Object.keys(config.imgFiles);
    return new Promise((done, notDone) => {
        getLocal(LOCAL_KEY).then(data => {
            if(isEmptyObject(data)){
                Promise.all(imgNames.map(imgName => {
                    let url = config.imgFiles[imgName].url
                    return loadImage(url);
                })).then(arr => {
                    Promise.all(arr.map((tempFilePath, index) => {
                        return saveFile(tempFilePath)
                    })).then(savedFilePaths => {
                        let result = {};
                        savedFilePaths.forEach((savedPath, index) => {
                            let imgName = imgNames[index];
                            result[imgName] = savedPath;
                        })
                        done(result)
                        setLocal(LOCAL_KEY, result);
                    }).catch(e => {
                        console.info('savefile error', e);
                        notDone(e);
                    })
                }).catch(e => {
                    // todo: handle the remote image load error
                    console.info('download image error', e)
                    notDone(e);
                })    
            }else{
                done(data);
            }
        }).catch(e => {
            // console.info('getlocal image list fail', e);
            Promise.all(imgNames.map(imgName => {
                let url = config.imgFiles[imgName].url
                return loadImage(url);
            })).then(arr => {
                Promise.all(arr.map((tempFilePath, index) => {
                    return saveFile(tempFilePath)
                })).then(savedFilePaths => {
                    let result = {};
                    savedFilePaths.forEach((savedPath, index) => {
                        let imgName = imgNames[index];
                        result[imgName] = savedPath;
                    })
                    done(result)
                    setLocal(LOCAL_KEY, result);
                }).catch(e => {
                    console.info('savefile error', e);
                    notDone(e);
                })
            }).catch(e => {
                // todo: handle the remote image load error
                console.info('download image error', e)
                notDone(e);
            }) 
        })
    })
}