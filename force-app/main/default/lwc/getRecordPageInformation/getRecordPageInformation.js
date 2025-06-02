import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';

const fields = [ ACCOUNT_NAME ]

export default class GetRecordPageInformation extends LightningElement {
    @api recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    }) record;

    get recordName(){
        return getFieldValue(this.record.data, ACCOUNT_NAME);
    }
}