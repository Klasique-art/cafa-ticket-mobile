import React, { forwardRef, memo, ReactNode } from "react";
import { View, ScrollView, StatusBar, ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AltScreenProps extends Omit<ScrollViewProps, 'children'> {
    children: ReactNode;
    statusBarStyle?: "default" | "light-content" | "dark-content";
    addPadding?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

const AltScreen = forwardRef<ScrollView, AltScreenProps>(
    ({ children, statusBarStyle = "dark-content", addPadding = true, onScroll, ...otherProps }, ref) => {
        return (
            <SafeAreaView className="h-full flex-1 bg-regular">
                <StatusBar barStyle={statusBarStyle} />
                <ScrollView
                    ref={ref}
                    onScroll={onScroll}
                    contentContainerStyle={{ minHeight: "100%" }}
                    showsVerticalScrollIndicator={false}
                    {...otherProps}
                >
                    <View style={{ flex: 1, paddingHorizontal: addPadding ? 10 : 0 }}>
                        {children}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
);

AltScreen.displayName = "AltScreen";

export default memo(AltScreen);