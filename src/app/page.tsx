"use client";
import { Button, View, Heading, Flex, Text } from "@aws-amplify/ui-react";
import Chat from "@/components/Chat";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Analytics } from "../../amplify/functions/analytics/analytics";
import { useEffect } from "react";
import { identifyUser } from "aws-amplify/analytics";
import { getCurrentUser } from "aws-amplify/auth";

type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export default function Home() {
  const { user, signOut } = useAuthenticator();
  const userId = user?.signInDetails?.loginId;

  const handleSignIn = async () => {
    await Analytics.trackAuthEvent("SIGN_IN", userId);
    signOut();
  };

  const handleSignOut = async () => {
    await Analytics.trackAuthEvent("SIGN_OUT", userId);
    signOut();
  };

  // async function getUserLocation(): Promise<UserCoordinates> {
  //   return new Promise((resolve, reject) => {
  //     if (!navigator.geolocation) {
  //       reject(new Error("Geolocation is not supported by this browser."));
  //       return;
  //     }

  //     navigator.geolocation.getCurrentPosition(
  //       (position: GeolocationPosition) => {
  //         const { latitude, longitude } = position.coords;
  //         resolve({ latitude, longitude });
  //       },
  //       (error: GeolocationPositionError) => {
  //         reject(new Error(`Failed to retrieve location: ${error.message}`));
  //       }
  //     );
  //   });
  // }

  // async function sendUserData() {
  //   try {
  //     const user = await getCurrentUser();
  //     const coords = await getUserLocation();

  //     const location = {
  //       latitude: coords.latitude,
  //       longitude: coords.longitude,
  //     };

  //     const userProfile = {
  //       location,
  //       name: user.username || "Unknown",
  //       email: user.signInDetails?.loginId || "Unknown",
  //     };
      

  //     identifyUser({
  //       userId: user.userId,
  //       userProfile,
  //     });

  //     console.log("User identification data sent.");
  //   } catch (err) {
  //     console.error("Error sending user data:", err);
  //   }
  // }

  // // Track page view + send location-enhanced user data
  // useEffect(() => {
  //   if (userId) {
  //     Analytics.trackPageView("home", userId);
  //     sendUserData();
  //   }
  // }, [userId]);

  return (
    <View className="app-container">
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
      >
        <Text fontWeight="bold">{"Welcome, " + userId}</Text>
        <Heading level={3}>HR Personal Assistant</Heading>
        <Button
          data-amplify-analytics-on="click"
          data-amplify-analytics-name="click" 
          onClick={handleSignOut} size="small" variation="destructive">
          Sign out
        </Button>
      </Flex>
      <View as="main">
        <Chat 
          data-amplify-analytics-on="click"
          data-amplify-analytics-name="click" 
        />
      </View>
    </View>
  );
}
