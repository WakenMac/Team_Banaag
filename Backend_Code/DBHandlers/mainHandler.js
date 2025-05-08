// Prepares the connection to the database:
// import { createClient } from '@supabase/supabase-js';

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
        const {data, error} = await supabaseClient.rpc('get_all_admin_records')
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function getAdminRecordByAdminID(adminId){
    try{
        if (typeof adminID !== 'string'){
            throw new error('ERROR: Admin ID must be a string.')
            return;
        }

        const {data, error} = await supabaseClient.rpc('get_admin_record_by_admin_id', {
            input_admin_id: adminId
        })
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function getAdminRecordByName(fName, mName, lName){
    try{
        if (typeof fName !== 'string' || typeof mName !== 'string' || typeof lName !== 'string')
            throw new error(`ERROR: getAdminRecordByName's parameters must be strings.`);

        const {data, error} = await supabaseClient.rpc('get_admin_record_by_name', {
            input_f_name: fName,
            input_m_name: mName,
            input_l_id: lName
        })
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function addAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        if (typeof fName !== 'string' || typeof mName !== 'string' || typeof lName !== 'string' ||
            typeof adminId !== 'string' || typeof adminPassword !== 'string')
            throw new error(`ERROR: addAdminRecord's parameters must be strings.`);

        const {data, error} = await supabaseClient.rpc('add_admin_record', {
            input_admin_id: adminId, 
            input_f_name: fName, 
            input_m_name: mName, 
            input_l_name: lName, 
            input_admin_password: adminPassword
        })
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function updateAdminRecordPassword(adminId, adminPassword){
    try{
        if (typeof adminId !== 'string' || typeof adminPassword !== 'string')
            throw new error(`ERROR: updateAdminRecord's parameters must be strings.`);

        const {data, error} = await supabaseClient.rpc('update_admin_record_password', {
            input_admin_id: adminId, 
            input_admin_password: adminPassword
        })
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function updateAdminRecord(adminId, fName, mName, lName, adminPassword){
    try{
        if (typeof fName !== 'string' || typeof mName !== 'string' || typeof lName !== 'string' ||
            typeof adminId !== 'string' || typeof adminPassword !== 'string')
            throw new error(`ERROR: updateAdminRecord's parameters must be strings.`);

        const {data, error} = await supabaseClient.rpc('update_admin_record', {
            input_admin_id: adminId, 
            input_f_name: fName, 
            input_m_name: mName, 
            input_l_name: lName, 
            input_admin_password: adminPassword
        })
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

export async function removeAdminRecordByAdminId(adminId){
    try{
        if (typeof adminId !== 'string')
            throw new error(`ERROR: removeAdminRecordByAdminId's parameters must be strings.`);

        const {data, error} = await supabaseClient.rpc('update_admin_record', {
            input_admin_id: adminId
        })
        
        if (error){
            console.error(`Supabase Error:`, error.message);
        }   else {
            return data;
        }
        
    } catch (error) {
        console.error("General error", error)
    }
}

// ======================================================================================================================================
// Methods for Item Master List

export async function getAllItems(){
    try{
        const {data, error} = await supabaseClient.rpc('get_all_item_master_list_records')
        
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

export async function getItemMasterListByItemID(item_id = 0){
    try{
        if (typeof item_id !== "number"){
            console.error("PARAMETER ERROR: getItemMasterListByID's item_id parameter must be a positive integer from 1 onwards.")
            return;
        }
        
        const {data, error} = await supabaseClient.rpc('get_item_master_list_record_by_item_id', {
            input_item_id : item_id
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
