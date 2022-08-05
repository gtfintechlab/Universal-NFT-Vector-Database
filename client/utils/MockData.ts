export const mockScatterChartPoints = {
  datasets: [
    {
      label: 'Scatter Dataset 1',
      fill: false,
      borderColor: '#f87979',
      backgroundColor: '#f87979',
      data: [
        {
          x: -2,
          y: 4
        },
        {
          x: -1,
          y: 1
        },
        {
          x: 0,
          y: 0
        },
        {
          x: 1,
          y: 1
        },
        {
          x: 2,
          y: 4
        }
      ]
    },
    {
      label: 'Scatter Dataset 2',
      fill: false,
      borderColor: '#7acbf9',
      backgroundColor: '#7acbf9',
      data: [
        {
          x: -2,
          y: -4
        },
        {
          x: -1,
          y: -1
        },
        {
          x: 0,
          y: 1
        },
        {
          x: 1,
          y: -1
        },
        {
          x: 2,
          y: -4
        }
      ]
    }
  ]
}

export const mockAnalyticsCardGroup = [
  {
    type: 'Analytics',
    title: 'Total NFTs in Vector Database',
    statistic: '500,223',
    subtitle: '432,000 NFTs in Task Queue'
  },
  {
    type: 'Analytics',
    title: 'Total NFTs in Vector Database',
    statistic: '500,223',
    subtitle: '432,000 NFTs in Task Queue'
  }
]

export const mockImageCardGroup = [{}, {}, {}, {}, {}, {}]


export const mockVectorDatabaseData = [
  {"Index Name": "all-nfts", "Namespace": "ethereum-erc721", "Number of Vectors": "274,022", "Vector Dimensions": "2,048", "Index Fullness": "0.5"},
  {"Index Name": "all-nfts", "Namespace": "polygon-erc721", "Number of Vectors": "166,056", "Vector Dimensions": "2,048", "Index Fullness": "0.5"},
  {"Index Name": "all-nfts", "Namespace": "ethereum-erc1155", "Number of Vectors": "10,456", "Vector Dimensions": "2,048", "Index Fullness": "0.5"},
  {"Index Name": "all-nfts", "Namespace": "polygon-erc1155", "Number of Vectors": "5,924", "Vector Dimensions": "2,048", "Index Fullness": "0.5"}
]
