import service from './Service.js';

export default class FileService {
    getFileFromServer(fileName){
        //returns Promise object
        return service.getRestClient().get('?fileName='+fileName,{ responseType:"blob" });
    }
}
