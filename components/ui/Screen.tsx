import { View, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from 'react';

interface ScreenProps {
    children: ReactNode;
    statusBarStyle?: "default" | "light-content" | "dark-content";
    statusBarBg?: string;
    className?: string;
}

const Screen = ({ children, statusBarStyle = "light-content", statusBarBg = "#1a2f56", className }: ScreenProps) => {

    return (
        <SafeAreaView style={[styles.screen]} className={`${className} bg-primary`}>
            <StatusBar backgroundColor={statusBarBg} barStyle={statusBarStyle} />
            <View style={{ flex: 1 }} className={`${className} bg-white px-2 pt-2`}>
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