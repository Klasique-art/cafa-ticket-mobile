import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import { Image } from "expo-image";

import { AppText, ImageUpload } from "@/components";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventImagesSection = () => {
    const { values, setFieldValue } = useFormikContext<EventFormValues>();

    const handleFeaturedImageChange = (base64Image: string | null) => {
        setFieldValue("featured_image", base64Image || "");
    };

    const handleAdditionalImagesChange = (base64Images: string[]) => {
        const currentImages = values.additional_images || [];
        const newImages = [...currentImages, ...base64Images];
        const limitedImages = newImages.slice(0, 5);
        setFieldValue("additional_images", limitedImages);
    };

    const handleRemoveAdditionalImage = (index: number) => {
        const currentImages = values.additional_images || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        setFieldValue("additional_images", newImages);
    };

    const additionalImages = (values.additional_images || []).filter(
        (img) => img && typeof img === "string" && img.length > 0
    );
    const canAddMore = additionalImages.length < 5;
    const remainingSlots = 5 - additionalImages.length;

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="image-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Event Images
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Add attractive images
                    </AppText>
                </View>
            </View>

            {/* Featured Image */}
            <View
                className="p-4 rounded-xl border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <AppText styles="text-sm text-white mb-3" font="font-ibold">
                    Featured Image
                </AppText>
                <ImageUpload
                    label="Upload Featured Image"
                    name="featured_image"
                    onImageChange={handleFeaturedImageChange}
                    currentImage={values.featured_image}
                    required
                    multiple={false}
                    helperText="Main event image (max 5MB, JPG/PNG/WEBP)"
                />
            </View>

            {/* Additional Images */}
            <View
                className="p-4 rounded-xl border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Additional Images (Optional)
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        {additionalImages.length}/5
                    </AppText>
                </View>

                {additionalImages.length === 0 ? (
                    <ImageUpload
                        label="Upload Additional Images"
                        name="additional_images"
                        onImageChange={() => {}}
                        onMultipleImagesChange={handleAdditionalImagesChange}
                        multiple={true}
                        helperText="Select up to 5 images at once (max 5MB each)"
                    />
                ) : (
                    <View className="gap-4">
                        {/* Images Grid */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                            {additionalImages.map((image, index) => (
                                <View key={index} className="relative mr-3">
                                    <Image
                                        source={{ uri: image }}
                                        style={{ width: 120, height: 120 }}
                                        className="rounded-xl"
                                        contentFit="cover"
                                    />

                                    {/* Remove Button */}
                                    <TouchableOpacity
                                        onPress={() => handleRemoveAdditionalImage(index)}
                                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full items-center justify-center"
                                        style={{ backgroundColor: colors.accent }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="close" size={16} color={colors.white} />
                                    </TouchableOpacity>

                                    {/* Image Number */}
                                    <View
                                        className="absolute bottom-2 left-2 px-2 py-0.5 rounded"
                                        style={{ backgroundColor: colors.primary + "CC" }}
                                    >
                                        <AppText styles="text-xs text-white" font="font-ibold">
                                            {index + 1}
                                        </AppText>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Add More Button */}
                        {canAddMore && (
                            <View className="border-2 border-dashed rounded-xl p-4" style={{ borderColor: colors.accent + "4D" }}>
                                <ImageUpload
                                    label={`Add More (${remainingSlots} remaining)`}
                                    name="additional_images_new"
                                    onImageChange={() => {}}
                                    onMultipleImagesChange={handleAdditionalImagesChange}
                                    multiple={true}
                                    compact
                                    helperText={`Select up to ${remainingSlots} more images`}
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Info Note */}
            <View
                className="p-3 rounded-lg border flex-row items-start gap-2"
                style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
            >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                <View className="flex-1">
                    <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        Image Guidelines
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Featured image shows on event cards
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Additional images in detail gallery
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Recommended: 1920x1080px or higher
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Max 5MB per image (JPG/PNG/WEBP)
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventImagesSection;