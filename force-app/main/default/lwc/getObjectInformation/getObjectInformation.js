import { LightningElement, wire } from 'lwc';
import getAvailableObjects from '@salesforce/apex/GetObjectInfoController.fetchAvailableObjectsInTheOrg';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const MESSAGE = 'There is no Object selected.'

export default class GetObjectInformation extends LightningElement {
    selectedObject;
    availableObjectOptions = [];
    isLoading = true;
    objectDetail;
    isLoadingObjectInfo = false;
    message = MESSAGE;
    
    @wire(getAvailableObjects)
    handleObjectsAvailable({ error, data }){
        if(data){
            this.availableObjectOptions = JSON.parse(data).map(option => {
                return {
                    label: option.label,
                    value: option.objectApiName
                }
            }).sort((a, b) => {
                if(a.label > b.label) return 1;
                else return -1;
            });
            this.isLoading = false;
        } else if(error) {
            console.error(error);
            this.availableObjectOptions = [];
            this.isLoading = false;
        }
    }

    @wire(getObjectInfo, { objectApiName: '$selectedObject'})
    handleObjectInformation({ error, data }){
        if(data){
            console.log(data);
            this.objectDetail = data;
            this.isLoadingObjectInfo = false;
        } else if(error){
            console.error(error);
            this.message = error.body.message;
            this.objectDetail = undefined;
            this.isLoadingObjectInfo = false;
        }
    }

    handleObjectSelection(e){
        this.selectedObject = e.detail.value;
        this.isLoadingObjectInfo = true;
    }
}