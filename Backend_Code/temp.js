// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

// ======================================================================================================================================
// Methods for Restocks

/**
 * Method to get all of the records on the Consumable Items table
 * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
 */
export async function getAllRestocksRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_restocks_records');
        
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
 * Method to get one record from the Consumable Items table based on its item ID
 * @param {integer} itemId The primary key of the Consumable Items table
 * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
 */
export async function getRestocksRecordsByItemId(itemId = 0){
    try{
        const [ iItemId ] = converter('int', itemId);

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: getAllRestocksRecordsByItetmId's itermID parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_restocks_record_by_restock_id', {
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
 * Gets all valid restocks to set to the restocks table (Front End)
 * @param {integer} itemId The primary key of the Consumable Items table
 * @returns A record consisting of 7 columns (Restock ID, Name, Initial Quantity, Used Quantity, Brand, Restock Date, and Expiry Date)
 */
export async function getAllValidRestocksRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_valid_restocks_record_view', {
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
 * Method to add a new row to the Restocks Table
 * @param {number} itemId               Primary Key of the item, to determince which item will be restocked
 * @param {string} restockDate          When you received the restock
 * @param {string} expiryDate           Expiration date of the restock
 * @param {number} initialQuantity      Quantity of the restock
 */
export async function addRestocksRecord(
    itemId, restockDate, expiryDate, initialQuantity
){
    try{
        const [ sRestockDate, sExpiryDate ] = converter('string', restockDate, expiryDate);
        const [ iItemId ] = converter('int', itemId);
        const [ iInitialQuantity ] = converter('float', initialQuantity);

        if (typeof sRestockDate !== 'string'){
            console.error("PARAMETER ERROR: addRestocksRecord's Brand/Model parameter must be a date.") // Must be a string
            return null;
        } else if (typeof sExpiryDate !== 'string'){
            console.error("PARAMETER ERROR: addRestocksRecord's Expiry Date must be a date.") // Must be a string
            return null;
        } else if (typeof iInitialQuantity !== 'number' || iInitialQuantity < 1){
            console.error("PARAMETER ERROR: addRestocksRecord's Initial Quantity must be a positive non-zero integer.")
            return null;
        } else if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: addRestocksRecord's Item ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('add_restocks_record', {
            input_item_id : iItemId,
            input_restock_date : sRestockDate,
            input_expiry_date : sExpiryDate, 
            initial_quantity : iInitialQuantity
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
 * Method to add a update a record from the Lab Equipments Table based on thier Item ID
 * @param {int} itemId                      ID of the item to be updated
 * @param {string} itemName                 Name of the consumable item to be added
 * @param {string} unitTypeName             Unit Type of the consumable item (e.g. Unit, Piece)
 * @param {string} locationName             Location where the item will be stored
 * @param {string} brandModel               Brand of the item to be added
 * @param {string} remarks                  Remarks of the item
 */
export async function updateRestocksRecordByAll(
    itemId, restockDate, expiryDate, initial_quantity
){
    try{
        const [ sRestockDate, sExpiryDate ] = converter('string', restockDate, expiryDate);
        const [ iItemId ] = converter('int', itemId);
        const [ iInitialQuantity ] = converter('float', iInitialQuantity);

        if (typeof sRestockDate !== 'string'){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Brand/Model parameter must be a date.") // Must be a string
            return null;
        } else if (typeof sExpiryDate !== 'string'){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Expiry Date must be a date.") // Must be a string
            return null;
        } else if (typeof iInitialQuantity !== 'number' || iInitialQuantity < 1){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Initial Quantity must be a positive non-zero integer.")
            return null;
        } else if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateRestocksRecordByAll's Item ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('updateRestocksRecordByAll', {
            input_item_id : iItemId,
            input_restock_date : sRestockDate,
            input_expiry_date : sExpiryDate, 
            initial_quantity : iInitialQuantity
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
 * Method to update an existing record's remarks in the Lab Equipments Table based on its Item ID
 * 
 * @param {int} itemId                  Primary key of the Consumable Items table
 * @param {string} remarks              Remarks of one specific item
 * 
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function updateRestocksRemarksByItemId(itemId, remarks = ''){
    try{
        const [ sRemarks ] = converter('string', remarks);
        const [ iItemId ] = converter('int', itemId);
        
        if (typeof sRemarks !== 'string'){
            console.error("PARAMETER ERROR: updateRestocksRemarksByItemId's Remarks parameter must be a string.")
            return null;
        }

        if (typeof iItemId !== 'number' || iItemId < 1){
            console.error("PARAMETER ERROR: updateRestocksRemarksByItemId's Item ID must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('update_restocks_remarks_by_restock_id', {
            input_item_id : iItemId,
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
 * Method to remove a record to the Lab Equipments table
 * @param {int} itemId The primary key of the Lab Equipments table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeRestocksRecordByRestockId(restockId = 0){
    try{
        const [ iRestockId ] = converter('int', restockId);

        if (typeof iRestockId !== 'number' || iRestockId < 1){
            console.error("PARAMETER ERROR: deleteRestocksRecordByItemId's Restock ID's parameter must be a positive non-zero integer.")
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_restocks_record_by_restock_id', {
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
