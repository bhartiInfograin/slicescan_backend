// const fs = require('fs');
const web3 = require('web3');
const solc = require('solc');
const { validationResult } = require('express-validator');


async function processBytecode(compiled_bytecode, blockchain_bytecode) {

    var cbyte = compiled_bytecode.slice(0, -86)
    var bByte = blockchain_bytecode.slice(2, -86)

    if (cbyte === bByte) {
        return "verify"
    } else {
        return "not verify"
    }

}




exports.verifyContract = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.json({ status: 422, message: "Invalid", data: errors.array() })
    }

    const {
        sourcescode,
        solidity_version,
        solidity_contract_name,
        txn_address,
        optimizer
    } = req.body


    const provider = new web3(new web3.providers.WebsocketProvider('wss://test-slice-rpc.com/ws'));
    const Web3 = provider;
    Web3.eth.net.isListening()
        .then((data) => {
            if (data == true) {
                var solc_version = solidity_version;
                var contract_name = solidity_contract_name;
                solc.loadRemoteVersion(solc_version, async (err, solc_specific) => {
                    if (solc_specific) {
                        var input_json = {
                            language: "Solidity",
                            sources: { file: { "content": sourcescode } },
                            settings: {
                                optimizer: {
                                    enabled: optimizer == 1 ? true : false,
                                    runs: 200
                                },
                                outputSelection: {
                                    "*": {
                                        "*": ["*"]
                                    }
                                }
                            }
                        }
                        // if solc successfully loaded, compile the contract and get the JSON output
                        var output = JSON.parse(solc_specific.compile(JSON.stringify(input_json)));

                 
                        if(output['contracts']["file"][contract_name] == undefined){
                            return res.json({statusCode:400,statusMsg:"Enter valid contract name"})
                        }else{
                            var compiled_bytecode = output['contracts']["file"][contract_name]['evm']['deployedBytecode']['object']
                            // // var api = output['contracts']["file"][contract_name].abi
                            var blockchain_bytecode = await Web3.eth.getCode(txn_address);
                            var processed_compiled_bytecode = await processBytecode(compiled_bytecode,blockchain_bytecode);
                            if(processed_compiled_bytecode){
                                return res.json({statusCode:200,statusMsg:processed_compiled_bytecode})
                            }
                        }
   
                    }
                    if(err){
                        console.log("err",err)
                        return res.json({statusCode:400,statusMsg:err})
                    }
                })
            }
        })
        .catch((error) => {
            return res.json({ statusCode: 400, statusMsg: error })
        })

}

exports.demo = async(req,res) => {
    res.json({statusmsg:"api runing"})
}







// 0x4FB206318A0603fc9957fb5c63E715350484fD44




// exports.solc = async (req, res) => {

//     // var demo = solc.loadRemoteVersion(solc_version, function (err, solc_specific) {
//     //     if (!err) {
//     //         var output = solc_specific.compile("contract t { function g() {} }", 1)
//     //         console.log("output", output)
//     //     }
    //     // })


//     // var contracts_directory = "../contracts";
//     // var contract_name = "Test"
//     // var contract_filename = "MyContract.sol"
//     // var is_optimized = 1

//     // var input = {}
//     // var files = fs.readdirSync("../contracts");

//     // for (file in files) {
//     //     let item = files[file];
//     //     if (item.slice(-4) == ".sol") {
//     //         let file_path = "../contracts" + '/' + item;
//     //         input[item] = fs.readFileSync(file_path, 'utf8');
//     //     }
//     // }

//     // var solc_version = "v0.8.7+commit.e28d00a7";
//     // var solc_version = "v0.4.16+commit.d7661dd9"

//     // fs.readFile('./contracts/MyContract.sol', 'utf8', (err, data) => {
//     //     if (err) {
//     //         console.error(err);
//     //         return;
//     //     }
//     //     if (data) {
//     //         // console.log("data", data)
//     //         if (data) {

//     //             // var input = {

//     //             //     language: 'Solidity',
//     //             //     sources: {
//     //             //         'MyContract.sol': {
//     //             //           content: data
//     //             //         }
//     //             //       }

//     //             // }

//     //             var input = {
//     //                 language: 'Solidity',
//     //                 sources: {
//     //                     'MyContract.sol': {
//     //                         content: data
//     //                     }
//     //                 },
//     //                 settings: {
//     //                     outputSelection: {
//     //                         '*': {
//     //                             '*': ['*']
//     //                         }
//     //                     }
//     //                 }
//     //             };





//     //             // var output = JSON.parse(solc.compile(JSON.stringify(input)));
//     //             // if (output) {
//     //             //     for (var contractName in output.contracts['MyContract.sol']) {
//     //             //         console.log(
//     //             //             contractName +
//     //             //             ': ' +
//     //             //             output.contracts['MyContract.sol'][contractName].evm.bytecode.object
//     //             //         );
//     //             //     }
//     //             // }




//     //             var demo = solc.loadRemoteVersion(solc_version, function (err, solc_specific) {
//     //                 if (!err) {
//     //                     var output = JSON.parse(solc_specific.compile(JSON.stringify(input), 1));
//     //                     // var output = JSON.parse(solc.compile(JSON.stringify(input)));
//     //                     // var output = solc_specific.compile(JSON.stringify(input), 1)
//     //                     // var bytecode = output['contracts'][contract_filename + ':' + contract_name]['runtimeBytecode'];
//     //                     console.log("output", output);
//     //                 }
//     //             });

//     //             // console.log("demo", demo)

//     //         }


//     //     } else {
//     //         return res.json({ statusCode: 500, statusMsg: "oop! somthing went wrong" })
//     //     }
//     // });

// }












// fs.readFile('./contracts/MyContract.sol', 'utf-8', (error, data) => {
//     if (error) {
//         console.log("error", error)
//     }
//     if (data) {
//         var solc_version = "v0.8.7+commit.e28d00a7";
//         var contract_filename = "MyContract.sol";
//         var contract_name = "Test"

//         solc.loadRemoteVersion(solc_version, (err, solc_specific) => {
//             if (solc_specific) {
//                 var input_json = {
//                     language: "Solidity",
//                     sources: { file: { "content": data } },
//                     settings: {
//                         optimizer: {
//                             enabled: true,
//                             runs: 200
//                         },
//                         outputSelection: {
//                             "*": {
//                                 "*": ["*"]
//                             }
//                         }
//                     }
//                 }
//                 // if solc successfully loaded, compile the contract and get the JSON output
//                 var output = JSON.parse(solc_specific.compile(JSON.stringify(input_json)));
//                 var bytecode = output['contracts']["file"][contract_name]['evm']['deployedBytecode']['object']
//                 console.log("bytecode", bytecode)

//             }
//         })
//     }
// })