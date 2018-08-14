import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: '编辑程序',
    icon: 'nb-edit',
    link: '/pages/crafts',
    home: true,
  },

  {
    title: '编辑订单',
    icon: 'nb-compose',
    link: '/pages/orders',
    // home: true,
  },
 
  {
    title: '用户管理',
    icon: 'nb-person',
    link: '/pages/manager',
  },
  
  {
    title: '技能管理',
    icon: 'nb-list',
    link: '/pages/skills',
  },

  {
    title: '退出',
    icon: 'nb-arrow-left',
    link: '/logout',
  },
];
