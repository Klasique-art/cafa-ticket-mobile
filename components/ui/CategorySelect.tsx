import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import { AppText, SelectInput } from "@/components";
import type { EventCategory } from "@/types/dash-events.types";
import { getEventCategories } from "@/lib/events";
import colors from "@/config/colors";

interface CategorySelectProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    label?: string;
    required?: boolean;
    error?: string;
}

const CategorySelect = ({
    value,
    onChange,
    onBlur,
    label = "Event Category",
    required = false,
}: CategorySelectProps) => {
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getEventCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <View>
                <AppText styles="text-sm text-white mb-2" font="font-imedium">
                    {label}
                    {required && (
                        <AppText styles="text-sm text-accent-50" font="font-imedium">
                            {" "}
                            *
                        </AppText>
                    )}
                </AppText>
                <View
                    className="flex-row items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: colors.primary100 }}
                >
                    <ActivityIndicator size="small" color={colors.accent} />
                    <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Loading categories...
                    </AppText>
                </View>
            </View>
        );
    }

    const options = categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
    }));

    return (
        <SelectInput
            name="category_slug"
            label={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            required={required}
            placeholder="Select a category"
        />
    );
};

export default CategorySelect;