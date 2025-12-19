import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const icon = {
    index: (props: any) => <Feather name="home" size={22} {...props} />,
    events: (props: any) => <Feather name="calendar" size={22} {...props} />,
    "dashboard-tab": (props: any) => <MaterialCommunityIcons name="chart-bar" size={22} {...props} />,
}