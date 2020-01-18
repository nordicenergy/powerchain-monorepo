set -e

# Create log directory for Geth
mkdir -p /var/log

# Start Geth and direct output to stdout
/geth \
    --verbosity 5 \
    --datadir node0/ \
    --syncmode 'full' \
    --nat none \
    --nodiscover \
    --port 30310 \
    --txpool.journal '' \
    --rpc \
    --rpcaddr '0.0.0.0' \
    --rpcport 8501 \
    --rpcvhosts '*' \
    --rpcapi 'personal,db,eth,net,web3,txpool,miner,debug' \
    --ws \
    --wsaddr 0.0.0.0 \
    --wsport 8546 \
    --wsorigins '*' \
    --wsapi 'personal,db,eth,net,web3,txpool,miner,debug' \
    --networkid 50 \
    --gasprice '2000000000' \
    --targetgaslimit 'powerchain4c4b400000' \
    --mine \
    --etherbase 'powerchaine8816898d851d5b61b7f950627d04d794c07ca37' \
    --unlock 'powerchaine8816898d851d5b61b7f950627d04d794c07ca37,powerchain5409ed021d9299bf6814279a6a1411a7e866a631,powerchain6ecbe1db9ef729cbe972c83fb886247691fb6beb,powerchaine36ea790bc9d7ab70c55260c66d52b1eca985f84,powerchaine834ec434daba538cd1b9fe1582052b880bd7e63,powerchain78dc5d2d739606d31509c31d654056a45185ecb6,powerchaina8dda8d7f5310e4a9e24f8eba77e091ac264f872,powerchain06cef8e666768cc40cc78cf93d9611019ddcb628,powerchain4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d,powerchain7457d5e02197480db681d3fdf256c7aca21bdc12,powerchain91c987bf62d25945db517bdaa840a6c661374402' \
    --password=node0/password.txt
