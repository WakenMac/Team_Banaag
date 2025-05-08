// Prepares the connection to the database:
// import { createClient } from '@supabase/supabase-js';
const url = "https://tkuqbdxvokhgfoipyoyr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdXFiZHh2b2toZ2ZvaXB5b3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDk4ODQsImV4cCI6MjA1NjMyNTg4NH0.zrNLQjJ7VUnHj2wLhxDxWzpN22b_tAOYPneyeh332gE";
const supabaseClient = supabase.createClient(url, key);
// const supabaseClient = createClient(url, key);

/**
 * Method used to test if we can access the mainHandler javascript file.
 */
export async function testPresence(){
    console.log("Main Handler is alive.");
}

// ======================================================================================================================================
// Methods for admins

/**
 * Method to get all of the records on the Admin table
 * @returns Multiple records consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
 */
export async function getAllAdmins(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_admin_records')
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to get all of the records on the Admin table
 * @param {Text} adminId Primary key of the Admin table used to find specific records
 * @returns A record consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
 */
export async function getAdminRecordByAdminID(adminId){
    try{
        let [ sAdminId ] = converter('string', adminId);

        if (typeof sAdminId !== 'string'){
            throw new Error('ERROR: Admin ID must be a string.')
            return null;
        }

        const {data, error: supabaseError} = await supabaseClient.rpc('get_admin_record_by_admin_id', {
            input_admin_id: adminId
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Method to get a record on the Admin table based on their name
 * @param {Text} fName First name of the admin
 * @param {Text} mName Middle name of the admin
 * @param {Text} lName Last name of the admin
 * @returns A record consisting of 4 columns (Admin ID, First Name, Middle Name, Last Name)
 */
export async function getAdminRecordByName(fName, mName, lName){
    try{
        let [ sFName, sMName, sLName ] = converter('string', fName, mName, lName );

        if (typeof sFName !== 'string' || typeof sMName !== 'string' || typeof sLName !== 'string')
            throw new Error(`ERROR: getAdminRecordByName's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('get_admin_record_by_name', {
            input_f_name: fName,
            input_m_name: mName,
            input_l_id: lName
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, supabaseError.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Adds a new record to the Admin table
 * @param {Text} adminId User-defined primary key of the Admin table
 * @param {Text} adminPassword Password of the admin to be using the database
 * @param {Text} fName First name of the admin
 * @param {Text} mName Middle name of the admin
 * @param {Text} lName Last name of the admin
 * @returns A text containing the status of the newly added record (Success or Error)
 */
export async function addAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        console.log(adminPassword);
        let [ sAdminId, sFName, sMName, sLName, sAdminPassword ] = converter('string', adminId, fName, mName, lName, adminPassword);

        if (typeof sAdminId !== 'string' || typeof sFName !== 'string' || typeof sMName !== 'string' ||
            typeof sLName !== 'string' || typeof sAdminPassword !== 'string')
            throw new Error(`ERROR: addAdminRecord's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('add_admin_record', {
            input_admin_id: adminId, 
            input_f_name: fName, 
            input_m_name: mName, 
            input_l_name: lName, 
            input_admin_password: adminPassword
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Updates the password of a record in the Admin table based on the adminId
 * @param {Text} adminId User-defined primary key of the Admin table
 * @param {Text} adminPassword Password of the admin to be using the database
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateAdminRecordPassword(adminId, adminPassword){
    try{
        let [ sAdminId, sAdminPassword ] = converter('string', adminId, adminPassword);

        if (typeof sAdminId !== 'string' || typeof sAdminPassword !== 'string')
            throw new Error(`ERROR: updateAdminRecord's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('update_admin_record_password', {
            input_admin_id: adminId, 
            input_admin_password: adminPassword
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Updates most of the attributes of an Admin record based on their adminId
 * @param {Text} adminId User-defined primary key of the Admin table
 * @param {Text} adminPassword Password of the admin to be using the database
 * @param {Text} fName First name of the admin
 * @param {Text} mName Middle name of the admin
 * @param {Text} lName Last name of the admin
 * @returns A string containing the status of the updated record (Success or Error)
 */
export async function updateAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        let [ sAdminId, sFName, sMName, sLName, sAdminPassword ] = converter('string', adminId, fName, mName, lName, adminPassword);

        if (typeof sAdminId !== 'string' || typeof sFName !== 'string' || typeof sMName !== 'string' ||
            typeof sLName !== 'string' || typeof sAdminPassword !== 'string')
            throw new Error(`ERROR: updateAdminRecord's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('update_admin_record', {
            input_admin_id: adminId, 
            input_f_name: fName, 
            input_m_name: mName, 
            input_l_name: lName, 
            input_admin_password: adminPassword
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

/**
 * Removes a record from the Admin table, whose admin has not made any transaction yet.
 * @param {Text} adminId User-defined primary key of the Admin table
 * @returns A string containing the status of the deleted record (Success or Error)
 */
export async function removeAdminRecordByAdminId(adminId){
    try{
        const [ sAdminId ] = converter('string', adminId);

        if (typeof sAdminId !== 'string')
            throw new Error(`ERROR: removeAdminRecordByAdminId's parameters must be strings.`);

        const {data, error: supabaseError} = await supabaseClient.rpc('remove_admin_record_by_admin_id', {
            input_admin_id: adminId
        })
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }   else {
            return data;
        }
        
    } catch (generalError) {
        console.error("General error", generalError)
        return null;
    }
}

// ======================================================================================================================================
// Methods for Item Master List

export async function getAllItems(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_item_master_list_records')
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

export async function getItemMasterListByItemID(item_id = 0){
    try{
        if (typeof item_id !== "number"){
            console.error("PARAMETER ERROR: getItemMasterListByID's item_id parameter must be a positive integer from 1 onwards.")
            return;
        }
        
        const {data, error: supabaseError} = await supabaseClient.rpc('get_item_master_list_record_by_item_id', {
            input_item_id : item_id
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

// ======================================================================================================================================
// Methods for location

/**
 * Method to get all of the records on the location table
 * @returns A record consisting of 4 columns (Location ID, Location Name)
 */
export async function getAllLocationRecords(){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('get_all_location_records', {
            input_item_id : item_id
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

/**
 * Method to get all of the records on the location table
 * @param {integer} locationId The primary key of the location table
 * @returns A record consisting of 4 columns (Location ID, Location Name)
 */
export async function getLocationRecordByLocationId(locationId){
    try{
        const [ sLocationId ] = converter('string', locationId);

        if (typeof sLocationId !== 'string'){
            console.error("PARAMETER ERROR: getLocationRecordByLocationId's locationId parameter must be a string.")
            return null;
        }
        

        const {data, error: supabaseError} = await supabaseClient.rpc('get_location_record_by_location_id', {
            input_location_id : sLocationId
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

/**
 * Method to get the  record of the location table
 * @param {integer} locationId The primary key of the location table
 * @returns A record consisting of 4 columns (Location ID, Location Name)
 */
export async function getLocationRecordByName(locationName){
    try{
        const [ sLocationName ] = converter('string', locationName);

        if (typeof sLocationId !== 'string'){
            console.error("PARAMETER ERROR: get_location_record_by_name's locationName parameter must be a string.")
            return null;
        }
        

        const {data, error: supabaseError} = await supabaseClient.rpc('get_location_record_by_name', {
            input_location_name : sLocationName
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

export async function addLocationRecord(locationName){
    try{
        const [ sLocationName ] = converter('string', locationName);

        if (typeof sLocationId !== 'string'){
            console.error("PARAMETER ERROR: add_location_record's locationName parameter must be a string.")
            return null;
        }
        

        const {data, error: supabaseError} = await supabaseClient.rpc('add_location_record', {
            input_location_name : sLocationName
        });
        
        if (supabaseError){
            console.error(`Supabase Error:`, error.message);
            return null;
        }
        
        return data;
        
    } catch (generalError) {
        console.error("General error", error)
        return null;
    }
}

// ======================================================================================================================================
// Methods for Restocks

export async function getAllRestocksRecords(){
    try{
        const {data, error} = await supabaseClient.rpc('get_all_restocks_records');
        
        if (error){
            console.error(`Supabase Error:`, error.message);
            return;
        }

        console.log(data);
        return data;
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function getRestocksRecordByRestockID(restockID = 0){
    try{
        if (typeof restockID !== "number"){
            console.error("PARAMETER ERROR: getItemMasterListByID's item_id parameter must be a positive integer from 1 onwards.")
            return;
        }

        const {data, error} = await supabaseClient.rpc('get_restocks_record_by_restock_id', {
            input_restock_id : restockID
        });
        
        if (error){
            console.error(`Supabase Error:`, error.message);
            return;
        }

        console.log(data);
        return data;
        
    } catch (error) {
        console.error("General error", error)
    }
}

//=======================================================================================================================================
// HELPER METHODS

/**
 * Converts the array of objects into strings
 * @param {string} [condition=''] The data type you want your data to be converted to (string, int, bigint, float)
 * @param {...*} objectArray The array of objects to be converted
 */
export function converter(condition = '', ...objectArray){
    if (!condition in ('string', 'int', 'bigint', 'float')){
        throw new Error('Kindly specify the condition for this method')
    }

    console.log(objectArray);
    let newArray = new Array(objectArray.length);

    for (let i = 0; i < objectArray.length; i++){
        if (condition === 'string')
            newArray[i] = String(objectArray[i])
        else if (condition === 'int')
            newArray[i] = Number(objectArray[i])
        else if (condition === 'bigint')
            newArray[i] = BigInt(objectArray[i])
        else if (condition === 'float')
            newArray[i] = parseFloat(String(objectArray[i]))

    }

    console.log(stringArray);
    return stringArray;
}