// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Chemicals

/**
 * Method to get all of the records on the unit type table
 * @returns A record consisting of 12 columns ()
 */
export async function getAllChemicalRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_chemicals_records');
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to get a record from the Chemicals table based on the item id
 * @param {integer} itemId The primary key of the Chemicals table
 * @returns A record consisting of 4 columns (Item ID, Name, Type, Quantity)
 */
export async function getChemicalsRecordByItemID(itemId){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: get_item_master_list_record_by_item_id's unitTypeId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_chemicals_record_by_item_id', {
            input_item_id : iItemId
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to add a new row to the Chemicals Table
 * @param {int} chemicalId                    Primary key of the Chemicals table
 * @param {string} chemicalName               Name of the chemical to be added
 * @param {string} chemicalUnit               Unit Type of the chemical (e.g. Millimeters, Grams)
 * @param {string} chemicalLocation           Location where the chemical will be stored
 * @param {string} chemicalBrand              Brand of the chemical to be added
 * @param {float} chemicalInitialQuantity    Initial quantity of the chemical
 * @param {float} chemicalRemainingQuantity  Remaining quantity of the chemical
 * @param {string} chemicalCASNo              CAS number of the chemical to be added
 * @param {string} chemicalMSDS               MSDS of the chemical to be added
 * @param {string} chemicalBarCode            Barcode of the chemical to be added
 */
export async function addChemicalsRecord(
        itemId, 
        locationName, 
        unitTypeName, 
        brandModel,
        containerSize,
        barcode,
        CASNo,
        MSDS,
        remarks
    ){
    try{
        const [ sLocationName, sUnitTypeName, sBrandModel, sBarcode, sCASNo, sMSDS, sRemarks ] = converter('string', 
            locationName, unitTypeName, brandModel, barcode, CASNo, MSDS, remarks);
        const [ iItemId ] = converter('string', itemId);
        const [ iContainerSize ] = converter('float', containerSize);

        if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sBarcode !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Barcode parameter must be a string.")
            return null;
        } else if (typeof sCASNo !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's CAS No. parameter must be a string.")
            return null;
        } else if (typeof sMSDS !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's MSDS parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Remarks parameter must be a string.")
            return null;
        }

        if ((typeof iItemId !== 'number' || iItemId < 1) || (typeof iContainerSize !== 'number' || iContainerSize < 1)){
            console.error("PARAMETER ERROR: addChemicalsRecord's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('main_add_chemicals_record', {
            input_item_id : iItemId,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
            input_container_size : iContainerSize,
            input_barcode : sBarcode,
            input_cas_no : sCASNo,
            input_msds : sMSDS,
            input_remarks : sRemarks
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to remove a record to the Chemicals table
 * @param {int} itemId The primary key of the Chemicals table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function deleteChemicalsRecordByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId)

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: removeItemMasterListRecordByItemId's itemId parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('delete_chemicals_record_by_item_id', {
            input_item_id : itemId
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 /**
 * Method to update an existing record in the Chemicals Table based on its Item ID
 * 
 * @param {int} chemicalId                      Primary key of the Chemicals table
 * @param {string} chemicalName                 Name of the chemical to be added
 * @param {string} chemicalUnit                 Unit Type of the chemical (e.g. Millimeters, Grams)
 * @param {string} chemicalLocation             Location where the chemical will be stored
 * @param {string} chemicalBrand                Brand of the chemical to be added
 * @param {float} chemicalInitialQuantity       Initial quantity of the chemical
 * @param {float} chemicalRemainingQuantity     Remaining quantity of the chemical
 * @param {string} chemicalCASNo                CAS number of the chemical to be added
 * @param {string} chemicalMSDS                 MSDS of the chemical to be added
 * @param {string} chemicalBarCode              Barcode of the chemical to be added
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function update_chemicals_record_by_all(
        itemId, 
        locationName, 
        unitTypeName, 
        brandModel,
        containerSize,
        barcode,
        CASNo,
        MSDS,
        remarks
    ){
    try{
        const [ sLocationName, sUnitTypeName, sBrandModel, sBarcode, sCASNo, sMSDS, sRemarks ] = converter('string', 
            locationName, unitTypeName, brandModel, barcode, CASNo, MSDS, remarks);
        const [ iItemId ] = converter('string', itemId);
        const [ iContainerSize ] = converter('float', containerSize);

        if (typeof sLocationName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Location Name parameter must be a string.")
            return null;
        } else if (typeof sUnitTypeName !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Unit Type Name parameter must be a string.")
            return null;
        } else if (typeof sBrandModel !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Brand/Model parameter must be a string.")
            return null;
        } else if (typeof sBarcode !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Barcode parameter must be a string.")
            return null;
        } else if (typeof sCASNo !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's CAS No. parameter must be a string.")
            return null;
        } else if (typeof sMSDS !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's MSDS parameter must be a string.")
            return null;
        } else if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: addChemicalsRecord's Remarks parameter must be a string.")
            return null;
        }

        if ((typeof iItemId !== 'number' || iItemId < 1) || (typeof iContainerSize !== 'number' || iContainerSize < 1)){
            console.error("PARAMETER ERROR: addChemicalsRecord's Item ID & Container Size parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_chemicals_record_by_all', {
            input_item_id : iItemId,
            input_location_name : sLocationName,
            input_unit_type_name : sUnitTypeName,
            input_brand_model : sBrandModel,
            input_container_size : iContainerSize,
            input_barcode : sBarcode,
            input_cas_no : sCASNo,
            input_msds : sMSDS,
            input_remarks : sRemarks
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}