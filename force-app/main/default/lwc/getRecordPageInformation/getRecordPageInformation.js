import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, getRecordUi } from 'lightning/uiRecordApi';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';

const fields = [ ACCOUNT_NAME ]

export default class GetRecordPageInformation extends LightningElement {
    @api recordId;
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
}