import React, { Component } from 'react';
import FileService  from './FileService.js';
import axios from 'axios';
import { saveAs } from 'file-saver';

 class DownloadFile extends Component {
    constructor() {
        super();
        this.fileService = new FileService();
        this.state={downloading:false};
    }

     extractFileName = (contentDispositionValue) => {
         var filename = "";
         if (contentDispositionValue && contentDispositionValue.indexOf('attachment') !== -1) {
             var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
             var matches = filenameRegex.exec(contentDispositionValue);
             if (matches != null && matches[1]) {
                 filename = matches[1].replace(/['"]/g, '');
             }
         }
         return filename;
     }

     getRestClient() {
       if (!this.serviceInstance) {
         this.serviceInstance = axios.create({
           baseURL: 'http://localhost:8080/api/file/downloadFile',
           timeout: 10000,
           headers: {
               'Content-Type': 'application/json'
             },
         });
       }
       return this.serviceInstance;
     }

    downloadFile = () => {
        let self = this;
        this.getRestClient().get('?fileName='+"ed687f27-93f1-4064-9eca-347543d7348a.jpg",{ responseType:"blob" }).then((response) => {
            this.setState({ downloading: false});
            var filename=this.extractFileName(response.headers['content-disposition']);
            saveAs(response.data, filename);
        }).catch(function (error) {
            if (error.response) {
                console.log('Error', error.response.status);
            } else {
                console.log('Error', error.message);
            }
        });
    };

    render() {
        console.log("state",this.state);
        return (
            <div>
                <button  onClick={this.downloadFile} > Download file</button>
                <label>{this.state.downloading ? 'Downloading in progress' : ''}</label>
            </div>
        )
    };
}


export default DownloadFile;
