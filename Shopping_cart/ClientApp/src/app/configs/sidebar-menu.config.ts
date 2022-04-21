export const SidebarMenuConfig = {
  items: [
    {
      title: 'DASHBOARD',
      bullet: 'dot',
      page: '/dashboard',
      translate: 'DASHBOARD',
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      // root: true,
      submenu: [
        {
          title: 'DASHBOARD',
          page: '/dashboard',
          translate: 'DASHBOARD',
        },
      ],
    },

    {
      title: 'PRODUCTS',
      page: '/products/product_list',
      translate: 'PRODUCTS',
    },

    {
      title: 'CART',
      page: '/cart/cart_detail_list',
      translate: 'CART',
    },

  ],
};
