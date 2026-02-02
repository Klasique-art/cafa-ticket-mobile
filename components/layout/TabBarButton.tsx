import { PlatformPressable } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { useEffect } from 'react';

import colors from '@/config/colors';
import { icon } from '@/constants/icon';

type Props = {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: string;
    label: string | ((props: { focused: boolean; color: string; position: 'beside-icon' | 'below-icon'; children: string }) => React.ReactNode);
    color?: string;
    href?: string;
    accessibilityLabel?: string;
}

const TabBarButton = ({ 
    onPress, 
    onLongPress, 
    isFocused, 
    routeName, 
    label, 
    href, 
    accessibilityLabel 
}: Props) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(
            typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, 
            { duration: 350 }
        );
    }, [scale, isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return { opacity };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);

        return { 
            transform: [{ scale: scaleValue }],
            top 
        };
    });

    // Generate accessible hint
    const accessibilityHint = isFocused 
        ? `Currently on ${typeof label === 'string' ? label : routeName} tab`
        : `Double tap to navigate to ${typeof label === 'string' ? label : routeName} tab`;

    return (
        <PlatformPressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
            // Accessibility props
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ 
                selected: isFocused,
                disabled: false 
            }}
            accessibilityLabel={accessibilityLabel || `${typeof label === 'string' ? label : routeName} tab`}
            accessibilityHint={accessibilityHint}
            // Haptic feedback & accessibility value
            accessibilityValue={{ 
                text: isFocused ? "selected" : "not selected" 
            }}
            href={href}
        >
            {typeof label === 'function' ? (
                label({
                    focused: isFocused,
                    color: isFocused ? colors.primary : colors.white,
                    position: 'beside-icon',
                    children: routeName,
                })
            ) : (
                <>
                    <Animated.View 
                        style={animatedIconStyle}
                        accessible={false}
                        importantForAccessibility="no-hide-descendants"
                    >
                        {icon[routeName as keyof typeof icon]({ 
                            color: isFocused ? colors.white : colors.accent 
                        })}
                    </Animated.View>
                    <Animated.Text 
                        style={[
                            { 
                                color: isFocused ? colors.primary : colors.white, 
                                fontSize: 10,
                                fontFamily: 'Inter-Medium',
                            }, 
                            animatedStyle
                        ]}
                        accessible={false}
                        importantForAccessibility="no-hide-descendants"
                    >
                        {label}
                    </Animated.Text>
                </>
            )}
        </PlatformPressable>
    )
}

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 5,
        gap: 3,
        // Ensure minimum touch target size (48x48dp on Android, 44x44pt on iOS)
        minHeight: 48,
        justifyContent: 'center',
    },
})

export default TabBarButton