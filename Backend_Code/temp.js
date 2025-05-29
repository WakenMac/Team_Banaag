// This is a temporary javascript file to prepare methods to be pasted in the mainHandler.js

import * as dbhandler from './mainHandler.js';

// Prepares the connection to the database:
import { createClient } from '@supabase/supabase-js';
const url = "https://tkuqbdxvokhgfoipyoyr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdXFiZHh2b2toZ2ZvaXB5b3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDk4ODQsImV4cCI6MjA1NjMyNTg4NH0.zrNLQjJ7VUnHj2wLhxDxWzpN22b_tAOYPneyeh332gE";
// const supabaseClient = supabase.createClient(url, key);
const supabaseClient = createClient(url, key);

// ======================================================================================================================================
// Methods for Transactions

// To be implemented.
/**
 * Method to add a update a record from the Lab Equipments Table based on thier Item ID
 * @param {int} itemId                      ID of the item to be updated
 * @param {string} itemName                 Name of the consumable item to be added
 * @param {string} unitTypeName             Unit Type of the consumable item (e.g. Unit, Piece)
 */
export async function returnTransactions(
    adminId, itemIdArray, borrowQuantityArray
){
    try{
        const {data, error: supabaseError} = await supabaseClient.rpc('main_return_transaction', {
            admin_id : adminId,
            item_id_array : itemIdArray,
            borrow_quantity_array : borrowQuantityArray
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