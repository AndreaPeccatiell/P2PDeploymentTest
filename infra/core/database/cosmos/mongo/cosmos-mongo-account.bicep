metadata description = 'Creates an Azure Cosmos DB for MongoDB account.'
param name string
param location string = resourceGroup().location
param tags object = {}
param disableKeyBasedMetadataWriteAccess bool = true
param keyVaultName string
param connectionStringKey string = 'AZURE-COSMOS-CONNECTION-STRING'
param publicNetworkAccess string
param disableLocalAuth bool = true

module cosmos '../../cosmos/cosmos-account.bicep' = {
  name: 'cosmos-account'
  params: {
    name: name
    location: location
    connectionStringKey: connectionStringKey
    keyVaultName: keyVaultName
    kind: 'MongoDB'
    tags: tags
    publicNetworkAccess: publicNetworkAccess
    disableLocalAuth: disableLocalAuth
    disableKeyBasedMetadataWriteAccess: disableKeyBasedMetadataWriteAccess
  }
}

output connectionStringKey string = cosmos.outputs.connectionStringKey
output endpoint string = cosmos.outputs.endpoint
output id string = cosmos.outputs.id
