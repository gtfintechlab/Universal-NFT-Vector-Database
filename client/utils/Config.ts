export const urls = {
  api: {
    server: {
      localhost: 'http://localhost:4000'
    },
    search: {
      localhost: 'http://localhost:5000',
      hosted: 'https://universal-nft-vector-database.web.app/api/search'
    }
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
