import { useSharedValue } from 'react-native-reanimated';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTabBarVisibility } from '@/context/TabBarContext';

const SCROLL_THRESHOLD = 10;

export const useScrollTabBar = () => {
    const { isVisible } = useTabBarVisibility();
    const lastScrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            'worklet';
            const currentScrollY = event.contentOffset.y;
            const scrollDiff = currentScrollY - lastScrollY.value;

            if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
                if (scrollDiff > 0 && currentScrollY > 50) {
                    // Scrolling down
                    isVisible.value = false;
                } else if (scrollDiff < 0) {
                    // Scrolling up
                    isVisible.value = true;
                }
                
                lastScrollY.value = currentScrollY;
            }
        },
    });

    return scrollHandler;
};