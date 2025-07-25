import { LightningElement, api, wire } from 'lwc';
import fetchAvailableObjectsInTheOrg from '@salesforce/apex/GetObjectInfoController.fetchAvailableObjectsInTheOrg';
import { getObjectInfo, getObjectInfos } from 'lightning/uiObjectInfoApi';

const INITIAL_OPTION = 'Account';

export default class DefineMainSObjectDetails extends LightningElement {
    isLoading = true;

    allAvailableObjects = [];
    validSObjects = [];
    selectedSObject;

    showAvailableFields;
    showMoreDetails;

    availableSObjectFields = [];
    selectedFields = ['Id'];

    filters;
    limitOfRecords;

    get fields(){
        return this.selectedFields.join(', ') || '<<fields>>';
    }

    @wire(fetchAvailableObjectsInTheOrg)
    handleAvailableSObjects({ error, data }){
        if(data){
            const parsedData = JSON.parse(data);
            this.allAvailableObjects = parsedData.map(sObject => sObject.objectApiName);
        } else if(error) {
            this.isLoading = false;
            console.log(error);
        }
    }

    @wire(getObjectInfos, { objectApiNames: '$allAvailableObjects'})
    validateSObjects({ error, data}){
        if(data){
            const objOptions = [];
            for(let sObj of data.results){
                if(sObj.statusCode === 200){
                    if(sObj.result.createable && sObj.result.updateable && sObj.result.deletable && sObj.result.layoutable && sObj.result.queryable){
                        objOptions.push({
                            label: sObj.result.label,
                            value: sObj.result.apiName,
                        });
                    }
                }
            }
            this.validSObjects = objOptions;
            this.selectedSObject = INITIAL_OPTION;
            this.isLoading = false;
        } else if(error){
            this.isLoading = false;
            console.error(error);
        }
    }

    @wire(getObjectInfo, { objectApiName: '$selectedSObject'})
    handleSelectedObjectInfo({ error, data}){
        if(data){
            this.resetQueryElements();
            const fields = [];
            for(let key in data.fields){
                fields.push({
                    label: data.fields[key].apiName,
                    value: data.fields[key].apiName
                });
            }
            this.availableSObjectFields = fields;
            this.selectedFields = [ 'Id', ...data.nameFields ];
            this.manageChanges();
        } else if(error){
            this.isLoading = false;
            console.error(error);
        }
    }

    handleSelectedObject(event){
        this.selectedSObject = event.detail.value;
        this.manageChanges();
    }

    handleFieldSelection(event){
        this.selectedFields = event.detail.value;
        this.manageChanges();
    }

    handleKeyup(event){
        this.filters = event.target.value;
        this.manageChanges();
    }

    handleLimitChange(event){
        this.limitOfRecords = event.target.value;
        this.manageChanges();
    }

    manageChanges(){
        const sendMainDetails = new CustomEvent('maindetail', {
            detail: {
                fields: this.fields,
                selectedSObject: this.selectedSObject,
                filters: this.filters,
                limitOfRecords: this.limitOfRecords
            }
        });
        this.dispatchEvent(sendMainDetails);
    }

    resetQueryElements(){
        this.filters = '';
        this.limitOfRecords = undefined;
    }
}