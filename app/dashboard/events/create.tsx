import { View } from "react-native";

import { Screen, AppText, RequireAuth, CreateEventForm, Nav } from "@/components";

const CreateEventScreen = () => {
  return (
    <Screen>
      <RequireAuth>
        <Nav title="Create Event" />

        <View className="flex-1 px-4 pb-6">
          <View className="mb-6">
            <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.6 }}>
              Fill in the details below to create your event
            </AppText>
          </View>

          <CreateEventForm />
        </View>
      </RequireAuth>
    </Screen>
  );
};

export default CreateEventScreen;