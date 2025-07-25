import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, getRecordUi } from 'lightning/uiRecordApi';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import { CurrentPageReference } from 'lightning/navigation'; 
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const fields = [ ACCOUNT_NAME ]

export default class GetRecordPageInformation extends LightningElement {
    @api recordId;
    @api objectApiName;
    accountLayoutSections = [];

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    }) record;

    get recordName(){
        return getFieldValue(this.record.data, ACCOUNT_NAME);
    }

    @wire(getRecordUi, { recordIds: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
    handleRecordLayout({ error, data }){
        if(data){
            this.accountLayoutSections = data.layouts.Account["012000000000000AAA"].Full.View.sections;
        } else if(error){
            console.error(error);
        }
    }

    @wire(CurrentPageReference)
    pageReference;

    get currentPageRefRecordId(){
        return this.pageReference ? this.pageReference.attributes.recordId : ''
    }

    @wire(getObjectInfo, {objectApiName: '$objectApiName'})
    handleObjectInfo({ error, data }){
        if(data){
            console.log(data);
        } else if(error){
            console.error(error);
        }
    }
}