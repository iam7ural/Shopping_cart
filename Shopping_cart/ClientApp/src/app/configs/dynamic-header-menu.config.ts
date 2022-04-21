export const DynamicHeaderMenuConfig = {
  items: [
    { section: 'ANA SƏHİFƏ', translate: 'MENU.DASHBOARD' },
    {
      title: 'ANA SƏHİFƏ',
      bullet: 'dot',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      icon: 'flaticon2-browser-2',
      svg: './assets/media/svg/icons/Shopping/MC.svg',
      access_admin: 1,
      access_idareiisler: 1,
      access_muhafize: 1,
      submenu: [
        {
          title: 'ANA SƏHİFƏ',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
          access_admin: 1,
          access_idareiisler: 1,
          access_muhafize: 1,
        },
      ],
    },

    { section: 'PRODUCTS', translate: 'PRODUCTS' },
    {
      title: 'PRODUCTS',
      bullet: 'dot',
      page: '/products',
      translate: 'PRODUCTS',
      icon: 'flaticon2-browser-2',
      svg: './assets/media/svg/icons/Shopping/MC.svg',
      submenu: [
        {
          title: 'PRODUCTS LIST',
          page: '/products/product_list',
          translate: 'PRODUCTS LIST',
        },
      ],
    },

    { section: 'CART', translate: 'CART' },
    {
      title: 'CART',
      bullet: 'dot',
      page: '/cart',
      translate: 'CART',
      icon: 'flaticon2-browser-2',
      svg: './assets/media/svg/icons/Shopping/MC.svg',
      submenu: [
        {
          title: 'CART DETAIL LIST',
          page: '/cart/cart_detail_list',
          translate:  'CART DETAIL LIST',
        },
      ],
    },


  ],
};
