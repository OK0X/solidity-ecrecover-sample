
const Recover = artifacts.require("Recover");

function fixSignature (signature) {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}


describe("test recover contract", function () {
  let accounts;
  let recover;
  before(async function () {
    // Gets accounts
    accounts = await web3.eth.getAccounts();

    // Deploys Recover contract
    recover = await Recover.new();
  });



  it("Recover", async function () {
    // test
    var address = accounts[0]
    console.log("address",address)
    var msg = '0x8CbaC5e4d803bE2A3A5cd3DbE7174504c6DD0c1C'

    var h = web3.utils.sha3(msg)
    console.log("h", h)

    var sig = await web3.eth.sign(h, address)
    var newSig = fixSignature(sig)
    console.log("new", newSig)

    var ethSignedMessageHash = await recover.toEthSignedMessageHash(h)
    console.log("ethSignedMessageHash", ethSignedMessageHash)

    let result = await recover.recover(ethSignedMessageHash, newSig)
    console.log("result", result);
  });
})
