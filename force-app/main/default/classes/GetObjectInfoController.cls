public class GetObjectInfoController {
    @AuraEnabled(cacheable=true)
    public static String fetchAvailableObjectsInTheOrg(){
        List<Object> objectsAvailable = new List<Object>();
        try {
            Map<String, SObjectType> globalDescribe = Schema.getGlobalDescribe();

            for(String objectName : globalDescribe.keySet()){
                Schema.SObjectType objectType = globalDescribe.get(objectName);
                Schema.DescribeSObjectResult describe = objectType.getDescribe();

                if(validObject(describe)){
                    Map<String, String> objectInformation = new Map<String, String>();
                    objectInformation.put('objectApiName', describe.getName());
                    objectInformation.put('label', describe.getLabel());
                    objectInformation.put('isCustomObject', String.valueOf(describe.isCustom()));

                    objectsAvailable.add(objectInformation);
                }
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return JSON.serialize(objectsAvailable);
    }

    private static Boolean validObject(Schema.DescribeSObjectResult describe){
        return describe.getRecordTypeInfosByName().get('Master') != null &&
                describe.isCreateable() && 
                describe.isUpdateable() &&
                describe.isDeletable() &&
                describe.isAccessible();
    }
}