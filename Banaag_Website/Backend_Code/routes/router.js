import { Router } from 'express';
import mainHandler  from '../controllers/mainHandler.js';

// Define authentication routes
const router = Router();

// Routes for admin
router.get('/admins/get-all-admins', mainHandler.getAllAdmins);
router.post('admins/get-admin-record-by-admin-id', mainHandler.getAdminRecordByAdminID)
router.post('/admins/admin-exists', mainHandler.adminExists);
router.post('/admins/add-admin-record', mainHandler.addAdminRecord);
router.patch('/admins/update-admin-record', mainHandler.updateAdminRecord)
router.delete('/admins/remove-admin-record', mainHandler.removeAdminRecordByAdminId);

// Routes for location:
router.get('/location/get-all-location-order-by-id', mainHandler.getAllLocationRecordsOrderById)
router.get('/location/get-all-location-order-by-name', mainHandler.getAllLocationRecordsOrderByName)
router.post('/location/add-location-record', mainHandler.addLocationRecord)
router.patch('/location/update-location-record', mainHandler.updateLocationRecordName)
router.delete('/location/remove-location-record', mainHandler.removeLocationRecordByLocationId)

// Routes for Unit Type
router.get('/unit-type/get-all-unit-type-order-by-id', mainHandler.getAllUnitTypeRecordsOrderById)
router.get('/unit-type/get-all-unit-type-order-by-name', mainHandler.getAllUnitTypeRecordsOrderByName)
router.post('/unit-type/add-unit-type-record', mainHandler.addUnitTypeRecord)
router.patch('/unit-type/update-unit-type-record', mainHandler.updateUnitTypeRecordName)
router.delete('/unit-type/remove-unit-type-record', mainHandler.removeUnitTypeRecordByUnitTypeId)

// Routes for Item Master List
router.get('/iml/get-all-iml-records', mainHandler.getAllItemMasterListRecords);
router.get('/iml/get-all-iml-name-records', mainHandler.getAllItemMasterListNameRecords);
router.get('/iml/get-all-iml-name-brand-records', mainHandler.getAllItemMasterListNameBrandRecords);
router.get('/iml/get-iml-by-item-id', mainHandler.getItemMasterListRecordByItemID);
router.get('/iml/get-iml-by-name', mainHandler.getItemMasterListRecordByName);
router.post('/iml/add-iml-record', mainHandler.addItemMasterListRecord);
router.patch('/iml/update-iml-record', mainHandler.updateItemMasterListRecord);
router.delete('/iml/remove-iml-record', mainHandler.removeItemMasterListRecordByItemId);

// Routes for Chemicals
router.get('/chemicals/get-all-chemical-records', mainHandler.getAllChemicalRecords);
router.post('/chemicals/add-chemical-records', mainHandler.addChemicalsRecord);
router.delete('/chemicals/delete-chemical-records', mainHandler.deleteChemicalsRecordByItemId);
router.patch('/chemicals/update-chemical-records', mainHandler.updateChemicalsRecordByAll);
router.patch('/chemicals/update-chemical-remarks', mainHandler.updateChemicalRemarkByItemId);

// Routes for Glasswares
router.get('/glasswares/get-all-glasswares-records', mainHandler.getAllGlasswaresRecords);
router.post('/glasswares/add-glasswares-records', mainHandler.addGlasswaresRecord);
router.delete('/glasswares/delete-glasswares-records', mainHandler.deleteChemicalsRecordByItemId);
router.patch('/glasswares/update-glasswares-records', mainHandler.updateGlasswaresRecordByAll);
router.patch('/glasswares/update-glasswares-remarks', mainHandler.updateGlasswaresRemarkByItemId);

// Routes for Lab Apparatus
router.get('/lab-apparatus/get-all-lab-apparatus-records', mainHandler.getAllLabApparatusRecords);
router.post('/lab-apparatus/add-lab-apparatus-records', mainHandler.addLabApparatusRecord);
router.delete('/lab-apparatus/delete-lab-apparatus-records', mainHandler.deleteLabApparatusRecordByItemId);
router.patch('/lab-apparatus/update-lab-apparatus-records', mainHandler.updateLabApparatusRecordByAll);
router.patch('/lab-apparatus/update-lab-apparatus-remarks', mainHandler.updateLabApparatusRemarkByItemId);

// Rotues for Lab Equipments
router.get('/lab-equipments/get-all-lab-equipments-records', mainHandler.getAllLabEquipmentsRecords);
router.post('/lab-equipments/add-lab-equipments-records', mainHandler.addLabEquipmentsRecord);
router.delete('/lab-equipments/delete-lab-equipments-records', mainHandler.deleteLabEquipmentsRecordByItemId);
router.patch('/lab-equipments/update-lab-equipments-records', mainHandler.updateLabEquipmentsRecordByAll);
router.patch('/lab-equipments/update-lab-equipments-remarks', mainHandler.updateLabEquipmentsRemarkByItemId);

// Routes for Consumable Items
router.get('/consumable-items/get-all-consumable-items-records', mainHandler.getAllConsumableItemsRecords);
router.post('/consumable-items/add-consumable-items-records', mainHandler.addConsumableItemsRecord);
router.delete('/consumable-items/delete-consumable-items-records', mainHandler.deleteConsumableItemsRecordByItemId);
router.patch('/consumable-items/update-consumable-items-records', mainHandler.updateConsumableItemsRecordByAll);
router.patch('/consumable-items/update-consumable-items-remarks', mainHandler.updateConsumableItemsRemarkByItemId);

// Routes for Restocks
router.get('/restocks/get-all-restocks-records', mainHandler.getAllRestocksRecords);
router.get('/restocks/get-all-valid-restocks-records', mainHandler.getAllValidRestocksRecords);
router.post('/restocks/add-restocks-records', mainHandler.addRestocksRecord);
router.delete('/restocks/delete-restocks-records', mainHandler.removeRestocksRecordByRestockId);
router.patch('/restocks/update-restocks-records', mainHandler.updateRestocksRecordByAll);
router.patch('/restocks/update-restocks-remarks', mainHandler.updateRestocksRemarksByRestockId);

// Routes for Transactions
router.get('/transaction/get-next-transaction-id', mainHandler.getNextTransactionId);
router.get('/transaction/get-all-transaction-records', mainHandler.getAllTransactionRecords);
router.get('/items-transacted/get-all-items-transacted-records', mainHandler.getAllItemsTransactedRecords);
router.post('/transaction/update-transaction-records', mainHandler.addTransactionRecord);
router.patch('/items-transacted/update-items-transacted', mainHandler.returnItemTransacted);


export default router; // Exports the router to become usable by server.js