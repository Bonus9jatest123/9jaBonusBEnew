'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import UserInitializer from '@/components/UserInitializer';


export const Providers = (props: React.PropsWithChildren) => {
  return <Provider store={store}>
    <UserInitializer />
    {props.children}
    </Provider>;
};
