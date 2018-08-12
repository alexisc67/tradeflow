var config = {
    userName: 'tradeflowadmin',
    password: 'LPGTradeFl0w',
    server: 'tradeflowdevsqlserver.database.windows.net',
    // When you connect to Azure SQL Database, you need these next options.  
    options: { encrypt: true, database: 'tradeflowsqldb', rowCollectionOnRequestCompletion: true}    
};

module.exports = config;