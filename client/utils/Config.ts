export const urls = {
  api: {
    server: {
      localhost: 'http://localhost:4000'
    },
    search: {
      localhost: 'http://localhost:5000',
      hosted: 'https://universal-nft-vector-database.web.app'
    },
    graphprotocol: {
      hosted: 'https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph'
    }
  },
  secrets: {
    doppler: 'https://api.doppler.com/v3/configs/config/secrets/download?format=json'
  }
}

export const sidebarConfig = {
  Utility: {
    Dashboard: {
      icon: 'bi:grid',
      link: '/dashboard',
      color: '#FFF'
    },
    Search: {
      icon: 'bx:search-alt',
      link: '/search',
      color: '#FFF'
    }
  },
  About: {
    'About this Project': {
      link: '/about',
      icon: 'akar-icons:info',
      color: '#FFF'
    },
    Contributors: {
      link: '/contributors',
      icon: 'akar-icons:person',
      color: '#FFF'
    }
  },
  Admin: {
    'Control Panel': {
      icon: 'bytesize:settings',
      link: '/admin',
      color: '#FFF'
    }
  }
}

export const noImageLoaded = Array(5).fill({
  title: 'No Image Available Yet',
  imageURL: 'https://i.ibb.co/Rczjykx/depositphotos-227724992-stock-illustration-image-available-icon-flat-vector.jpg',
  subtitle: { Status: 'No action has occurred to load an image' }

})
