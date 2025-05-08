// Prepares the connection to the database:
// import { createClient } from '@supabase/supabase-js';
import * as helper from '../helper.js';

const url = "https://tkuqbdxvokhgfoipyoyr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdXFiZHh2b2toZ2ZvaXB5b3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDk4ODQsImV4cCI6MjA1NjMyNTg4NH0.zrNLQjJ7VUnHj2wLhxDxWzpN22b_tAOYPneyeh332gE";
const supabaseClient = supabase.createClient(url, key);
// const supabaseClient = createClient(url, key);

export async function testPresence(){
    console.log("Main Handler is alive.");
}

// ======================================================================================================================================
// Methods for admins

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

export async function getAdminRecordByAdminID(adminId){
    try{
        let [ sAdminId ] = toString(adminId);

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

export async function getAdminRecordByName(fName, mName, lName){
    try{
        let [ sFName, sMName, sLName ] = toString( fName, mName, lName );

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

export async function addAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        console.log(adminPassword);
        let [ sAdminId, sFName, sMName, sLName, sAdminPassword ] = toString(adminId, fName, mName, lName, adminPassword);

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

export async function updateAdminRecordPassword(adminId, adminPassword){
    try{
        let [ sAdminId, sAdminPassword ] = toString(adminId, adminPassword);

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

export async function updateAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        let [ sAdminId, sFName, sMName, sLName, sAdminPassword ] = toString(adminId, fName, mName, lName, adminPassword);

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

export async function removeAdminRecordByAdminId(adminId){
    try{
        const [ sAdminId ] = toString(adminId);

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
 */
export function toString(...objectArray){
    console.log(objectArray);
    let stringArray = new Array(objectArray.length);

    for (let i = 0; i < objectArray.length; i++){
        stringArray[i] = String(objectArray[i])
    }

    console.log(stringArray);

    return stringArray;
}