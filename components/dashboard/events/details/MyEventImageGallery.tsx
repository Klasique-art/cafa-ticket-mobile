import { View, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import AppText from "../../../ui/AppText";

interface MyEventImageGalleryProps {
    images: string[];
    eventTitle: string;
}

const MyEventImageGallery = ({ images, eventTitle }: MyEventImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            <View className="gap-4">
                {/* Section Header */}
                <View className="flex-row items-center gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: "#a855f7" + "33" }}
                    >
                        <Ionicons name="images-outline" size={20} color="#a855f7" />
                    </View>
                    <View>
                        <AppText styles="text-base text-white" font="font-ibold">
                            Event Gallery
                        </AppText>
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            {images.length} {images.length === 1 ? "image" : "images"}
                        </AppText>
                    </View>
                </View>

                {/* Horizontal Gallery */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16, gap: 12 }}
                >
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedIndex(index)}
                            activeOpacity={0.9}
                            className="relative"
                        >
                            <Image
                                source={{ uri: image }}
                                className="w-64 h-40 rounded-xl"
                                resizeMode="cover"
                            />

                            {/* Zoom Icon Overlay */}
                            <View className="absolute top-2 right-2 w-8 h-8 rounded-lg items-center justify-center bg-black/50 backdrop-blur-sm">
                                <Ionicons name="expand-outline" size={16} color="#fff" />
                            </View>

                            {/* Image Counter */}
                            <View className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md">
                                <AppText styles="text-xs text-white" font="font-isemibold">
                                    {index + 1} / {images.length}
                                </AppText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Fullscreen Modal */}
            {selectedIndex !== null && (
                <Modal
                    visible={true}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedIndex(null)}
                >
                    <View className="flex-1 bg-black/95">
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setSelectedIndex(null)}
                            className="absolute top-12 right-4 w-12 h-12 rounded-full items-center justify-center z-10"
                            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>

                        {/* Image */}
                        <View className="flex-1 items-center justify-center">
                            <Image
                                source={{ uri: images[selectedIndex] }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                        </View>

                        {/* Navigation Controls */}
                        {images.length > 1 && (
                            <>
                                <TouchableOpacity
                                    onPress={() =>
                                        setSelectedIndex((prev) =>
                                            prev === 0 ? images.length - 1 : (prev || 0) - 1
                                        )
                                    }
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center"
                                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="chevron-back" size={24} color="#fff" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() =>
                                        setSelectedIndex((prev) =>
                                            (prev || 0) === images.length - 1 ? 0 : (prev || 0) + 1
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center"
                                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Image Counter */}
                        <View
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl"
                            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        >
                            <AppText styles="text-sm text-white" font="font-isemibold">
                                {selectedIndex + 1} / {images.length}
                            </AppText>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

export default MyEventImageGallery;