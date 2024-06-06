param accountName string
param location string = resourceGroup().location
param tags object = {}

param collections array = [
  {
    name: 'TodoList'
    throughput: 400
    indexKey: '/id'  // Ensure the partition key is appropriate for your data model
  }
  {
    name: 'TodoItem'
    throughput: 400
    indexKey: '/id'  // Ensure the partition key is appropriate for your data model
  }
]
param databaseName string = ''
param keyVaultName string

var defaultDatabaseName = 'Todo'
var actualDatabaseName = !empty(databaseName) ? databaseName : defaultDatabaseName

resource cosmosSqlDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-08-15' = {
  name: '${accountName}/${actualDatabaseName}'
  location: location
  properties: {
    resource: {
      id: actualDatabaseName
    }
    options: {}
  }
}

resource cosmosSqlContainers 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-08-15' = [for collection in collections: {
  name: '${accountName}/${actualDatabaseName}/${collection.name}'
  location: location
  properties: {
    resource: {
      id: collection.name
      indexingPolicy: {
        indexingMode: 'consistent'
        includedPaths: [
          {
            path: '/*'
          }
        ]
      }
      partitionKey: {
        paths: [
          collection.indexKey
        ]
        kind: 'Hash'
      }
      defaultTtl: -1
    }
    options: {
      throughput: collection.throughput
    }
  }
}]

output connectionStringKey string = cosmosSqlDatabase.name
output databaseName string = actualDatabaseName
output endpoint string = cosmosSqlDatabase.properties.resource._self
