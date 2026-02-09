import { View, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from 'react';

import colors from '@/config/colors';

interface ScreenProps {
    children: ReactNode;
    statusBarStyle?: "default" | "light-content" | "dark-content";
    statusBarBg?: string;
    className?: string;
}

const Screen = ({ children, statusBarStyle = "dark-content", statusBarBg = colors.primary, className="bg-white" }: ScreenProps) => {

    return (
        <SafeAreaView style={[styles.screen]} className={`${className} bg-primary`}>
            <StatusBar backgroundColor={statusBarBg} barStyle={statusBarStyle} />
            <View style={{ flex: 1 }} className={`${className} px-2 pt-2`}>
                {children}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    }
})

export default Screen