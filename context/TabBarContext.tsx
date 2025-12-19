import React, { createContext, useContext, ReactNode } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

interface TabBarContextType {
    isVisible: SharedValue<boolean>;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const isVisible = useSharedValue(true);

    return (
        <TabBarContext.Provider value={{ isVisible }}>
            {children}
        </TabBarContext.Provider>
    );
};

export const useTabBarVisibility = () => {
    const context = useContext(TabBarContext);
    if (!context) {
        throw new Error('useTabBarVisibility must be used within TabBarProvider');
    }
    return context;
};