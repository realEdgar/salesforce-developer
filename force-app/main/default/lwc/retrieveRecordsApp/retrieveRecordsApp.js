import { LightningElement, track } from 'lwc';
import retrieveRecords from '@salesforce/apex/RetrieveRecordsAppController.retrieveRecords';
import Name from '@salesforce/schema/Account.Name';

const SUCCESS_STATUS = 'SUCCESS';
const ERROR_STATUS = 'ERROR'

export default class RetrieveRecordsApp extends LightningElement {
    fields;
    SObjectApiName;
    filters;
    noRecords;
    isError = false;
    errorMessage;

    @track configObject;
    @track data = [];
    dataHasChildRecords = false;

    get mainObjectColumns(){
        return this.configObject.fields.map(field => ({
            label: field,
            fieldName: field,
            wrapText: true
        }));
    }

    handleChange(event){
        const fieldName = event.target.name;
        this[fieldName] = event.detail.value;
    }

    handleQuerySubmit(event){
        event.preventDefault();
        const params = {
            fields: this.fields,
            SObjectApiName: this.SObjectApiName,
            filters: this.filters,
            noRecords: this.noRecords,
        }
        this.responseManager(params);
    }
    async responseManager(params){
        const response = await retrieveRecords(params);
        const result = JSON.parse(response);
        // console.log('DATA', JSON.stringify(result.data));

        if(result.status === SUCCESS_STATUS){
            this.isError = false;
            this.errorMessage = '';
            this.dataHasChildRecords = false;
            this.configObject = this.buildConfigObject();
            this.data = result.data.map(record => {
                const newRecord = { ...record }
                if(this.configObject.subqueries.length > 0){
                    newRecord['childObjects'] = this.configObject.subqueries.map(query => {
                        const childRecord = {};
                        childRecord.data = newRecord[query.object]?.records || [];
                        childRecord.object = query.object;
                        childRecord.cols = query.fields.map(field => {
                            return {
                                label: field,
                                fieldName: field,
                                wrapText: true
                            }
                        });
                        return childRecord;
                    });
                    this.dataHasChildRecords = true;
                }
                
                return newRecord;
            });
        } else if(result.status === ERROR_STATUS){
            this.isError = true;
            this.errorMessage = result.errorMessage;
        }
    }
    buildConfigObject(){
        const configObject = {
            fields: [],
            subqueries: [],
            objectName: ''
        }

        const cleanedQuery = this.fields.replace(/\s+/g, ' ').trim();

        const subqueryRegex = /\(\s*SELECT\s+([^)]+)\s+FROM\s+(\w+)\s*(?:WHERE\s+([^)]+?))?(?:\s*LIMIT\s+(\d+))?\s*\)/gi;

        let match;
        while((match = subqueryRegex.exec(cleanedQuery)) !== null){
            const subqueryFields = match[1].split(',').map(field => field.trim());
            const subqueryObject = match[2];
            const whereClause = match[3] ? match[3].trim() : null;
            const limitClause = match[4] ? parseInt(match[4], 10) : null;

            configObject.subqueries.push({
                object: subqueryObject,
                fields: subqueryFields,
                whereClause: whereClause,
                limit: limitClause
            });
        }

        let mainFieldsString = cleanedQuery;
        subqueryRegex.lastIndex = 0;
        mainFieldsString = mainFieldsString.replace(subqueryRegex, '').replace(/\s+/g, ' ').trim();

        const mainFields = mainFieldsString.split(',').map(field => field.trim());
        for(let field of mainFields){
            if(field) configObject.fields.push(field);
        }
        configObject.objectName = this.SObjectApiName;

        return configObject;
    }
    buildChildTables(){
        let tableCols = [];
        if(this.configObject.subqueries.length > 0){
            tableCols = this.configObject.subqueries.map(subquery => {
                return {
                    object: subquery.object,
                    cols: subquery.fields.map(field => ({ label: field, fieldName: field, wrapText: true }))
                }
            });
        }
        return tableCols;
    }
}