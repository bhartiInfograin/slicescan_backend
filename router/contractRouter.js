const express = require('express');
const router = express.Router();
const { body } = require('express-validator');



const {
    verifyContract,
    demo
} = require('../controller/contractController')



router.post("/verifyContract", [
    body("sourcescode")
        .exists()
        .not()
        .isEmpty()
        .withMessage("sourcecode required"),
    body("solidity_version")
        .exists()
        .not()
        .isEmpty()
        .withMessage("solidity_version required"),
    body("solidity_contract_name")
        .exists()
        .not()
        .isEmpty()
        .withMessage("solidity_contract_name required"),
    body("optimizer")
        .exists()
        .not()
        .isEmpty()
        .withMessage("optimizer required"),
    body("txn_address")
        .exists()
        .not()
        .isEmpty()
        .withMessage("transaction address required"),

    

], verifyContract)

router.get('/demo',demo)

module.exports = router