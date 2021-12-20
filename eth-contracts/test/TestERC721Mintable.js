var ERC721MintableComplete = artifacts.require('PDS_ERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 2, {from: account_one});
            await this.contract.mint(account_three, 3, {from: account_one});
            await this.contract.mint(account_three, 4, {from: account_one});
            await this.contract.mint(account_three, 5, {from: account_one});
        })

        it('should return total supply', async function () {
            var supply = await this.contract.totalSupply();
            // console.log(supply.toNumber());
            // ASSERT
            assert.equal(supply, 4, "Incorrect total supply.");
        })

        it('should get token balance', async function () { 
            var balance_two = await this.contract.balanceOf(account_two);
            var balance_three = await this.contract.balanceOf(account_three);
            assert.equal(balance_two, 1, "Incorrect balance for owner 1");
            assert.equal(balance_three, 3, "Incorrect balance for owner 3");

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            uri = await this.contract.tokenURI(2)
            assert.equal(uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", "Incorrect token URI");
        })

        it('should transfer token from one owner to another', async function () { 
            // owner will transfer token it 3 to account number 2
            await this.contract.safeTransferFrom(account_three, account_two, 3, {from: account_three})

            // now check balances
            var balance_two = await this.contract.balanceOf(account_two);
            var balance_three = await this.contract.balanceOf(account_three);
            assert.equal(balance_two, 2, "Incorrect balance for owner 1");
            assert.equal(balance_three, 2, "Incorrect balance for owner 3");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
                await this.contract.mint(account_two, 2, {from: account_two});
            } catch (err) {
                failed = true;
            }
            assert.equal(failed, true, "We couldn't not mint contract with account_two when contract owner is account_one");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract._owner.call();
            assert.equal(owner, account_one, "Owner of the contract is account_one");
        })
    });
})