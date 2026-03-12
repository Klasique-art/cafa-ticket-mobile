import React from "react";
import { View, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Screen from "@/components/ui/Screen";
import Nav from "@/components/ui/Nav";
import AppText from "@/components/ui/AppText";
import colors from "@/config/colors";
import { APP_EMAIL, APP_NUMBER } from "@/data/constants";
import {
  privacyHighlights,
  privacyLastUpdated,
  privacyPolicySections,
} from "@/data/privacy";

const PrivacyScreen = () => {
  const handleEmailPress = async () => {
    const mailUrl = `mailto:${APP_EMAIL}`;
    if (await Linking.canOpenURL(mailUrl)) {
      await Linking.openURL(mailUrl);
    }
  };

  const handleCallPress = async () => {
    const phoneUrl = `tel:${APP_NUMBER.replace(/[^\d+]/g, "")}`;
    if (await Linking.canOpenURL(phoneUrl)) {
      await Linking.openURL(phoneUrl);
    }
  };

  return (
    <Screen>
      <Nav title="Privacy Policy" />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View className="gap-6">
            <View
              className="p-5 rounded-2xl border-2"
              style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center border"
                  style={{ backgroundColor: colors.accent + "33", borderColor: colors.accent + "66" }}
                >
                  <Ionicons name="shield-checkmark-outline" size={24} color={colors.accent50} />
                </View>
                <View className="flex-1">
                  <AppText styles="text-base text-white font-nunbold mb-1">
                    Your privacy and data security are our top priorities
                  </AppText>
                  <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                    Last Updated: {privacyLastUpdated}
                  </AppText>
                </View>
              </View>
            </View>

            <View className="gap-3">
              {privacyHighlights.map((item) => (
                <View
                  key={item.id}
                  className="rounded-xl p-4 border"
                  style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "33" }}
                >
                  <View className="flex-row items-start gap-3">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center border"
                      style={{ backgroundColor: colors.accent + "26", borderColor: colors.accent + "4D" }}
                    >
                      <Ionicons name={item.icon} size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                      <AppText styles="text-sm text-white font-nunbold">{item.title}</AppText>
                      <AppText styles="text-xs text-white mt-1" style={{ opacity: 0.7 }}>
                        {item.description}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View
              className="rounded-xl p-4 border"
              style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "33" }}
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="document-text-outline" size={18} color={colors.accent50} />
                <AppText styles="text-sm text-white font-nunbold">Table of Contents</AppText>
              </View>
              <View className="gap-2">
                {privacyPolicySections.map((section) => (
                  <View key={section.id} className="flex-row items-start gap-2">
                    <AppText styles="text-xs font-nunbold" style={{ color: colors.accent50 }}>
                      {section.id}.
                    </AppText>
                    <AppText styles="text-xs text-slate-200 flex-1">{section.title}</AppText>
                  </View>
                ))}
              </View>
            </View>

            <View className="gap-4">
              {privacyPolicySections.map((section) => (
                <View
                  key={section.id}
                  className="rounded-xl p-4 border"
                  style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "33" }}
                >
                  <View className="flex-row items-start gap-3 pb-3 mb-3 border-b" style={{ borderColor: colors.accent + "33" }}>
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center border"
                      style={{ backgroundColor: colors.accent + "33", borderColor: colors.accent + "66" }}
                    >
                      <AppText styles="text-xs font-nunbold" style={{ color: colors.accent50 }}>
                        {section.id}
                      </AppText>
                    </View>
                    <AppText styles="text-sm text-white font-nunbold flex-1">{section.title}</AppText>
                  </View>

                  <View className="gap-2">
                    {section.content.map((paragraph, index) => (
                      <AppText key={`${section.id}-${index}`} styles="text-xs text-slate-200 leading-5">
                        {paragraph}
                      </AppText>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            <View
              className="rounded-xl p-5 border-2"
              style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "66" }}
            >
              <View className="items-center">
                <Ionicons name="shield-checkmark-outline" size={34} color={colors.accent50} />
                <AppText styles="text-base text-white font-nunbold mt-3 mb-2">
                  Questions About Your Privacy?
                </AppText>
                <AppText styles="text-xs text-slate-200 text-center mb-4">
                  If you have concerns about how we handle your data, contact us and we will help.
                </AppText>
              </View>

              <View className="gap-3">
                <TouchableOpacity
                  className="rounded-xl p-3 items-center"
                  style={{ backgroundColor: colors.accent }}
                  onPress={handleEmailPress}
                  activeOpacity={0.8}
                >
                  <AppText styles="text-sm text-white font-nunbold">Email Us</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  className="rounded-xl p-3 items-center border"
                  style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "66" }}
                  onPress={handleCallPress}
                  activeOpacity={0.8}
                >
                  <AppText styles="text-sm text-white font-nunbold">Call Us</AppText>
                </TouchableOpacity>
              </View>
            </View>

            <View
              className="rounded-xl p-4 border"
              style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}
            >
              <AppText styles="text-xs text-slate-200 text-center mb-2">
                By using Cafa Ticket, you agree to our Privacy Policy and Terms of Service.
              </AppText>
              <TouchableOpacity
                className="items-center"
                onPress={() => router.push("/terms")}
                activeOpacity={0.8}
              >
                <AppText styles="text-xs font-nunbold underline" style={{ color: colors.accent50 }}>
                  Read our Terms of Service
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default PrivacyScreen;
